let chrome = require('selenium-webdriver/chrome');
const { Origin, Builder, By, Key, until } = require('selenium-webdriver');
const assert = require('assert');

// Test Miniaylo table

async function mClaim(driver) {

    //find cell
    let veryComplexSelector = {xpath: '(//tbody[@class="on-data"]/tr)[3]'};
    await driver.wait(async ()=>{
        let els = await driver.findElements(veryComplexSelector);
        let size = await els.length;
        return size > 0;
    }, 20 * 1000);

    let row = await driver.findElement(veryComplexSelector);
    let cells = await row.findElements({xpath: './td'});

    /**
     * The code is not working as expected
     */
    // let cellsWithCurrency = await cells.filter(async (cell)=>{
    //     let text = await cell.getText();
    //     console.log(text);
    //     return /.*\d\d\.\d\d.*/.test(text);
    // });
    // console.log(`cells after filter - ${await cellsWithCurrency.length}`);
    // let cell = await cellsWithCurrency[0]

    let cell = await cells.reduce(async (acc, el)=>{
        let text = await el.getText();
        if(/.*\d\d\.\d\d.*/.test(text)) {
            return el;
        } else {
            return acc;
        }
    }, null);


    console.log(`There is cell with currency. It text is - '${await cell.getText()}'`)

    console.log('claim the el with marker');
    driver.executeScript(`arguments[0].setAttribute("el-id", "my-cell"); arguments[0].setAttribute("style", "background-color:red;");`, cell);

    console.log('sort table by Currency');
    await driver.findElement({xpath: '//*[contains(@class,"tablesorter") and text()="Курс"]'}).click();
}

async function mFindClaimClaim(driver) {

    let cell = await driver.findElement({xpath: '//*[@el-id="my-cell"]'});
    await driver.executeScript('arguments[0].scrollIntoView(false);', cell);
   
    console.log(`There is still cell with currency. It text is - '${await cell.getText()}'`)

}

(async () => {
    let driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(
            new chrome.Options().addArguments([
                //"--incognito",
                "--start-maximized",
                "--ignore-certificate-errors",
                "--disable-popup-blocking",
                '--disable-gpu',
                '--test-type',
                '--disable-extensions',
                '--enable-crash-reporter-for-testing',
                '--no-sandbox',
                '--disable-infobars'
            ])
            .setUserPreferences({
                // disable chrome's annoying password manager
                'profile.password_manager_enabled': false,
                'credentials_enable_service': false,
                'password_manager_enabled': false,
                // Set download path and avoid prompting for download even though
                // this is already the default on Chrome but for completeness
                'download': {
                    'prompt_for_download': false,
                    'directory_upgrade': true,
                    'default_directory': '~/Downloads',
                },
            }))
        .build();
    driver.manage().setTimeouts( { implicit: 0, pageLoad: 300 * 1000, script: 30 * 1000 } );

    await driver.get('https://miniaylo.finance.ua/')

    await mClaim(driver);

    await mFindClaimClaim(driver);


    console.log("\n---SUCCESS---\n");


    await driver.quit();
})();
