const {Builder, By, Key, until} = require('selenium-webdriver');
const assert = require('assert');

let driver = new Builder()
    .forBrowser('chrome')
    .setChromeOptions(/* ... */)
    .build();


// Test Sinoptik Title

expectedTitle = "Погода у Києві";

driver.get('https://ua.sinoptik.ua').then(()=>{
    return driver.findElement(By.css("#search_city")).sendKeys('Kyiv', Key.RETURN);
}).then(()=>{
    return driver.findElement(By.css("div.cityName > h1"))}).then((el)=>{
        return el.getText().then((txt)=>{
            return assert.equal(txt, expectedTitle, "Wrong City name");
        });
}).then(()=>{
    return driver.quit();
});