// Whole-script strict mode syntax (ES6)
"use strict";

var packageJson = require('./package.json');

var ProgressBar = require('progress');
var Table = require('cli-table');
var colors = require('colors/safe');

var path = require('path');
var glob = require('glob');
var urljoin = require('url-join');
var fs = require('fs');
var program = require('commander');
var xpath = require('xpath');
var dateFormat = require('dateformat');
var DOMParser = require('xmldom').DOMParser;
var XMLSerializer = require('xmldom').XMLSerializer;
var request = require('sync-request');



program
    .version(packageJson.version)
    .option(
    '-i, --input <path>',
    'input xml files path /glob notation/ (eg: test_results/junit-xml-reporter/report_xml_output*.xml)'
    )
    .option(
    '-s, --server <url>',
    'link to TestRail server (eg: http://192.168.242.249/testrail)'
    )
    .option(
    '-a, --api [url]',
    'api route (eg: index.php?/api/v2), defaulting [index.php?/api/v2]',
    'index.php?/api/v2'
    )
    .option(
    '-p, --project <id>',
    'project id (eg: 1)'
    )
    .option(
    '-u, --user <email>',
    'user email (eg: admin@admin.com)'
    )
    .option(
    '-k, --key <password>',
    'user password or api key (eg: lMyQyuDDvKifokMsppDA)'
    )
    .option(
    '-r, --release [version]',
    'text with version of application wich has been tested. ' +
    'Will be added to plan name (eg: FE:1.25.0.1302 BE:1.25.0.1452)'
    )
    .parse(process.argv);

printAppStamp();

var testrailServer = program.server;
var apiRoute = program.api;
var projectId = program.project;
var userEmail = program.user;
var apiKey = program.key;
var testFilesPath = program.input; //glob notation
var testAppVersion = program.release;


//base auth string
var authString =
    new Buffer(userEmail + ":" + apiKey).toString("base64");

//if exist parse versions file
var appVersionText = '';
if (testAppVersion) {
    appVersionText = testAppVersion;
}

var listOfResultsForAllCases = findTestrailCases(testFilesPath);

var listOfAllSuites = getListOfAllSuites();

//creating new plan with all available suites
var createdPlan = addPlanWithSuites(listOfAllSuites, appVersionText);
console.log(
    `\nPlan '${colors.magenta(createdPlan.name)}'` +
    ` created with '${colors.cyan(listOfAllSuites.length)}' suites.\n`
);

var listOfRunsInPlan = getRunsFromPlan(createdPlan);

//add results for all runs in plan
publishResults(listOfRunsInPlan, listOfResultsForAllCases);

//green success message
console.log(colors.green('Done! All tests has been processed.'));
//link to plan on TestRail
console.log(
    `Check TestRail plan at ${colors.cyan(createdPlan.url)} to view the results.`
);

/*
 * find testrail cases in files (glob notation)
 * return: concatenated list of objects returned by findTestrailCasesInXml()
 */
function findTestrailCases(testFilesPath) {

    console.log(
        `\nTest results location: '${testFilesPath}'\n`
    );

    var listOfXmlFilePaths = glob.sync(testFilesPath);

    if (listOfXmlFilePaths.length < 1) {
        throw new Error(
            `No files found at '${testFilesPath}'`
        );
    }


    let bar = new ProgressBar(
        'Parsing test result files [:bar] :percent',
        {
            complete: '=',
            incomplete: ' ',
            width: 20,
            total: listOfXmlFilePaths.length,
            clear: true
        }
    );

    let table = new Table({
        head: ['File', 'Cases'],
        colWidths: [50, 10],
        style: { compact: true, 'padding-left': 1 }
    });

    let listOfResultsForAllCases = [];

    for (let xmlFilePath of listOfXmlFilePaths) {

        //parse report file to XML
        let xmlFile = fs.readFileSync(xmlFilePath, 'utf8');
        let parsedXmlFile = new DOMParser().parseFromString(xmlFile);

        //get all available testrail results in junit report
        let listOfResultsFromXmlFile = findTestrailCasesInXml(parsedXmlFile);

        bar.tick();
        table.push([path.parse(xmlFilePath).name, listOfResultsFromXmlFile.length]);


        listOfResultsForAllCases =
            listOfResultsForAllCases.concat(listOfResultsFromXmlFile);
    }

    table.push([]);
    table.push([' '.repeat(20) + 'TOTAL', colors.cyan(listOfResultsForAllCases.length)]);

    console.log(colors.bold('---Parsing details---'));
    console.log(table.toString());

    return listOfResultsForAllCases;

}

/*
 * find testrail cases in list of total cases (xml list)
 * return: list of objects [object is result for case]
 * http://docs.gurock.com/testrail-api2/reference-results#add_result_for_case
 */
function findTestrailCasesInXml(testResultsXml) {

    let testcaseXPathQuery = '//testcase';

    //find in xmlFile list of testcases (with xPath query)
    let listOfXmlTestcases =
        xpath.select(testcaseXPathQuery, testResultsXml);

    let regexp = /#TRC-(\d+);/g;

    let listOfResults = [];

    for (let i = 0; i < listOfXmlTestcases.length; i++) {

        let execResult;
        while (
            execResult = regexp.exec(listOfXmlTestcases[i].getAttribute(
                'name'))
        ) {

            let resObj = {};
            resObj['case_id'] = execResult[1];
            resObj['status_id'] =
                getStatusFromTestcaseElement(listOfXmlTestcases[i]);
            resObj['comment'] = listOfXmlTestcases[i].toString();

            listOfResults.push(resObj);
        }
    }

    return listOfResults;
}



/*
 * filter list of all cases results only for special run cases results
 */
function filterListOfResultsRegardingSpecialRun(listOfResults, run) {

    let listOfCasesFromRun = getCasesFromSuite(run.suite_id);

    let filteredListOfResults = listOfResults.filter(function (elem) {
        let flag = false;
        for (let caseFromRun of listOfCasesFromRun) {
            if (caseFromRun.id == elem.case_id) {
                flag = true;
            }
        }
        return flag;
    });

    return filteredListOfResults;
}

/*
 * publish results for all runs (using addResultsForRun() and filterListOfResultsRegardingSpecialRun())
 */
function publishResults(listOfRuns, listOfResults) {

    let bar = new ProgressBar(
        'Publishing results on TestRail [:bar] :percent',
        {
            complete: '=',
            incomplete: ' ',
            width: 20,
            total: listOfRuns.length,
            clear: true
        }
    );

    let table = new Table({
        head: ['TestRun', 'Staus'],
        colWidths: [30, 30],
        style: { compact: true, 'padding-left': 1 }
    });

    for (let run of listOfRuns) {

        let listOfResultsForSpecialRun = filterListOfResultsRegardingSpecialRun(
            listOfResults,
            run
        );

        let status = '';
        if (listOfResultsForSpecialRun.length > 0) {
            addResultsForRun(run.id, listOfResultsForSpecialRun);
            status = colors.green('Results has been added');
        } else {
            status = colors.yellow('No results for run');
        }

        bar.tick();
        table.push([run.name, status]);

    }

    console.log(colors.bold('---Publishing details---'));
    console.log(table.toString());

}

/*
 * add results for run
 * http://docs.gurock.com/testrail-api2/reference-results#add_results_for_cases
 */
function addResultsForRun(runId, listOfResults) {

    let objectOfResults = {
        "results": listOfResults
    };

    let addResultsForCasesRoute = "add_results_for_cases/";

    let url = urljoin(testrailServer, apiRoute, addResultsForCasesRoute, runId);
    let resForAddResultsForCases = request(
        'POST',
        url,
        {
            "headers": {
                "Authorization": "Basic " + authString,
                "Content-Type": "application/json"
            },
            "body": JSON.stringify(objectOfResults)
        }
    );

    if (resForAddResultsForCases.statusCode != 200) {
        throw new Error(
            `Status code for '${addResultsForCasesRoute}'should be 'OK',` +
            ` but resaved: '${resForAddResultsForCases.statusCode}'.` +
            `\nRequest url: '${url}'.`
        );
    }

    var resultsForRun = JSON.parse(resForAddResultsForCases.getBody().toString());

    return resultsForRun;
}


/*
 * get all cases from special suite
 * http://docs.gurock.com/testrail-api2/reference-cases#get_cases
 */
function getCasesFromSuite(suiteId) {

    let getCasesRoute = "get_cases/";
    let queryString = `&suite_id=${suiteId}`;

    let url = urljoin(testrailServer, apiRoute, getCasesRoute, projectId, queryString)

    let resForGetCases = request(
        'GET',
        url,
        {
            "headers": {
                "Authorization": "Basic " + authString,
                "Content-Type": "application/json"
            }
        }
    );

    if (resForGetCases.statusCode != 200) {
        throw new Error(
            `Status code for '${getCasesRoute}'should be 'OK', but resaved: '${resForGetCases.statusCode}'.` +
            `\nRequest url: '${url}'.`
        );
    }

    var casesFromSpecialSuite = JSON.parse(resForGetCases.getBody().toString());

    return casesFromSpecialSuite;
}


/*
 * get available list of suites
 */
function getListOfAllSuites() {


    let getSuitesRoute = "get_suites/";

    let url = urljoin(testrailServer, apiRoute, getSuitesRoute, projectId);

    let resForGetSuites = request(
        'GET',
        url,
        {
            "headers": {
                "Authorization": "Basic " + authString,
                "Content-Type": "application/json"
            }
        }
    );

    if (resForGetSuites.statusCode != 200) {
        throw new Error(
            `Status code for '${getSuitesRoute}'should be 'OK', but resaved: '${resForGetSuites.statusCode}'.` +
            `\nRequest url: '${url}'.`
        );
    }

    var allSuites = JSON.parse(resForGetSuites.getBody().toString());

    return allSuites;
}

/*
 * add testplan with suites
 */
function addPlanWithSuites(listOfSuites, versionStamp) {

    let addPlanRoute = "add_plan/";

    let planObject = {
        "name": "UI Auto Tests Execution/" +
        dateFormat(Date.now(), "yyyy-mm-dd HH:MM:ss") + "/" +
        versionStamp + "/",
        "entries": []
    };


    for (let suite of listOfSuites) {

        let entrieObject = {
            "suite_id": suite.id,
            "name": suite.name
        };

        planObject.entries.push(entrieObject);
    }

    let url = urljoin(testrailServer, apiRoute, addPlanRoute, projectId);

    let resForAddPlan = request(
        'POST',
        url,
        {
            "headers": {
                "Authorization": "Basic " + authString,
                "Content-Type": "application/json"
            },
            "body": JSON.stringify(planObject)
        }
    );

    if (resForAddPlan.statusCode != 200) {

        throw new Error(
            `Status code for '${addPlanRoute}'should be 'OK', but resaved: '${resForAddPlan.statusCode}'.` +
            `\nRequest url: '${url}'.`
        );
    }

    var createdPlan = JSON.parse(resForAddPlan.getBody().toString());

    return createdPlan;
}

/*
 * get all runs from existed plan
 */
function getRunsFromPlan(plan) {

    let listOfRuns = [];

    for (let entrie of plan.entries) {
        for (let run of entrie.runs) {
            listOfRuns.push(run);
        }
    }

    return listOfRuns;
}

/*
 * convert JUnit test status to testrail status post model
 * http://docs.gurock.com/testrail-api2/reference-results#add_result
 */
function getStatusFromTestcaseElement(elem) {

    let res;
    if (xpath.select('./failure', elem).length > 0) {
        res = 5; // failed

    } else if (xpath.select('./skipped', elem).length > 0) {
        res = null; // do not send status

    } else {
        res = 1; //passed
    }

    return res;
}

function printAppStamp() {
    console.log('\n');
    console.log('*'.repeat(60));
    console.log(`*${' '.repeat(21)}AUTORAIL v${packageJson.version}${' '.repeat(22)}*`);
    console.log('*'.repeat(60));
    console.log('\n');
}
