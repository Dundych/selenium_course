const {Builder, By, Key, until} = require('selenium-webdriver');
const assert = require('assert');

// Test Sinoptik 10 days


(async function sinoptik_example() {
    let driver =  await new Builder().forBrowser('chrome').setChromeOptions(/* ... */).build();

    await driver.get('https://ua.sinoptik.ua')
    await driver.findElement(By.css("#search_city")).sendKeys('Kyiv', Key.RETURN);

    async function getDaysDisplayed(){
        let els =  await driver.findElements(By.xpath("//*[@class='tabs']/descendant::*[@class='day-link']"));
        return els.length;
    }

    let days = await getDaysDisplayed();
    assert.equal(days, 7, `Days displayed are not equal to 7, but '${days}'`) 

    await driver.findElement(By.xpath("//*[@id='topMenu']/*[contains(text(), '10')]")).click();
    await driver.wait(until.urlContains('10'), 5 * 1000)

    days = await getDaysDisplayed();
    assert.equal(days, 10, `Days displayed are not equal to 10, but '${days}'`)

    await driver.quit();

    console.log("\n---SUCCESS---\n")
})();
