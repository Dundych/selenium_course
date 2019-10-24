let chrome = require('selenium-webdriver/chrome');
const {Builder, By, Key, until} = require('selenium-webdriver');
const assert = require('assert');

// Test Google Maps
async function gmaps(driver) {
    
    await driver.get('https://www.google.com.ua/maps')


    let qElLoc = By.xpath("//*[@name='q']");
    await driver.wait(until.elementLocated(qElLoc), 5 * 1000);
    let qEl = driver.findElement(qElLoc);
    await qEl.sendKeys("Kyiv", Key.RETURN);
    

    let btnDirectionsLoc = By.xpath("//img[contains(@src,'directions')]");
    await driver.wait(until.elementLocated(btnDirectionsLoc), 10 * 1000);
    let btnDirections = driver.findElement(btnDirectionsLoc);
    await btnDirections.click();

    // type Odessa
    let startPoint = "Odessa";
    let searchInput0Loc = By.xpath("//*[@id='directions-searchbox-0']/descendant::input");
    await driver.wait(until.elementLocated(searchInput0Loc), 5 * 1000);
    let searchInput0 = driver.findElement(searchInput0Loc);
    await searchInput0.sendKeys(startPoint, Key.RETURN);

    // //click near Vasylkiv
    // await driver.sleep(10 * 1000);
    // let startPoint = "Vasylkiv"
    // await driver.actions({bridge: true})
    //     .move({x: 1000, y: 800})
    //     .press()
    //     .release()
    //     .perform();
    // await driver.sleep(3 * 1000);


    let elDriveTimeLoc = By.xpath("//*[contains(@class,'drive')]/ancestor::*[contains(@id,'section-directions-trip')]/descendant::*[contains(@class, 'directions-trip-duration')]");
    await driver.wait(until.elementLocated(elDriveTimeLoc), 10 * 1000);
    let elDriveTime = driver.findElement(elDriveTimeLoc);
    let drTime = await elDriveTime.getText();
    console.log(`Actual drive time from ${startPoint} to Kyiv - ${drTime}`)

    console.log(`\n${arguments.callee.name} - OK`)
}

(async ()=> {
    let driver =  await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(new chrome.Options().addArguments([
            //"--incognito",
            "--start-maximized",
            "--ignore-certificate-errors",
            "--disable-popup-blocking"
        ]))
        .build();
    await gmaps(driver);
    await driver.quit();
})();