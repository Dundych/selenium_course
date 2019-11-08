let chrome = require('selenium-webdriver/chrome');
const { Origin, Builder, By, Key, until } = require('selenium-webdriver');
const assert = require('assert');

// Test Google Maps 

/**
 * Method to set destination on gmaps
 * @param {driver<WebDriver>}
 * @param {json search obj} eg: {text: "Odessa"}, eg: {coords: {x: 1000, y: 800}}
 */
async function gmaps(driver, search_obj) {

    await driver.get('https://www.google.com.ua/maps')


    let qElLoc = By.xpath("//*[@name='q']");
    await driver.wait(until.elementLocated(qElLoc), 5 * 1000);
    let qEl = driver.findElement(qElLoc);
    await qEl.sendKeys("Kyiv", Key.RETURN);


    let btnDirectionsLoc = By.xpath("//img[contains(@src,'directions')]");
    await driver.wait(until.elementLocated(btnDirectionsLoc), 10 * 1000);
    let btnDirections = driver.findElement(btnDirectionsLoc);
    await btnDirections.click();

    if (search_obj.hasOwnProperty('text')) {
        // type Odessa
        let searchInput0Loc = By.xpath("//*[@id='directions-searchbox-0']/descendant::input");
        await driver.wait(until.elementLocated(searchInput0Loc), 5 * 1000);
        let searchInput0 = driver.findElement(searchInput0Loc);
        await searchInput0.sendKeys(search_obj["text"], Key.RETURN);
    } else if (search_obj.hasOwnProperty('coords')) {
        //click near Vasylkiv
        await driver.sleep(10 * 1000);

        await driver.actions({ bridge: false })
            .move(search_obj["coords"])
            .press()
            .release()
            .perform();
        await driver.sleep(5 * 1000);
    } else {
        throw `Error: param 'search_obj' should has a key 'text' or 'coords'`
    }

    let elDriveTimeLoc = By.xpath("//*[contains(@class,'drive')]/ancestor::*[contains(@id,'section-directions-trip')]/descendant::*[contains(@class, 'directions-trip-duration')]");
    await driver.wait(until.elementLocated(elDriveTimeLoc), 10 * 1000);
    let elDriveTime = driver.findElement(elDriveTimeLoc);
    let drTime = await elDriveTime.getText();
    console.log(`Actual drive time from point ${JSON.stringify(search_obj)} to Kyiv - ${drTime}`)
    await driver.sleep(10 * 1000);

    console.log(`\n${arguments.callee.name} - OK`)
}

(async () => {
    let driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(new chrome.Options().addArguments([
            //"--incognito",
            "--start-maximized",
            "--ignore-certificate-errors",
            "--disable-popup-blocking"
        ]))
        .build();
    await gmaps(driver, { text: "Odessa" });
    await gmaps(driver, { coords: { x: 1000, y: 600, origin: Origin.VIEWPORT } });
    await driver.quit();
})();