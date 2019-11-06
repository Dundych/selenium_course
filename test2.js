const {Builder, By, Key, until} = require('selenium-webdriver');
const assert = require('assert');

let driver = new Builder()
    .forBrowser('chrome')
    .setChromeOptions(/* ... */)
    .build();


// Test Sinoptik Title, get History Max Min for that day
expectedTitle = "Погода у Києві";

driver.get('https://ua.sinoptik.ua').then(()=>{
    return driver.findElement({css: "#search_city"}).sendKeys('Kyiv', Key.RETURN);
}).then(()=>{
    return driver.findElement(By.css("div.cityName > h1"));
}).then((el)=>{
    return el.getText();
}).then((txt)=>{
    return assert.equal(txt, expectedTitle, "Wrong City name");
}).then(()=>{
    return driver.findElement({xpath: "//p[@class='infoHistory']/ancestor::*[@class='lSide']"});
}).then((el)=>{
    return el.getText();
}).then((txt)=>{
    console.log(txt); // just log all

    let maxYear = Number(txt.match(/\d\d\d\d/g)[0]); // max year
    let minYear = +txt.match(/\d\d\d\d/g)[1]; // min year
    let maxTemp = +txt.match(/.?\d+(\.\d+)?\°/g)[0].slice(0,-1); //max temp
    let minTemp = +txt.match(/.?\d+(\.\d+)?\°/g)[1].slice(0,-1); //min temp
    
    console.log("---parsed values---"); // sep
    console.log(`Max temp ${maxTemp} was in ${maxYear}\nMin temp ${minTemp} was in ${minYear}`)

    let yearNow = (new Date()).getFullYear();
    assert.equal(true, maxYear > (yearNow - 130), "Fail. max Year is older then 130 years ago")
    assert.equal(true, minYear > (yearNow - 130), "Fail. min Year is older then 130 years ago")
    assert.equal(true, maxTemp >= minTemp, "Fail. min temp greater or equal to max temp")

}).then(()=>{
    console.log("\n---SUCCESS---\n")
    return driver.quit();
}).catch((err)=>{
    console.log("Error:", err);
    console.log("\n---FAIL---\n")
});