const {Builder, By, Key, until} = require('selenium-webdriver');
const assert = require('assert');


let timestamp = Date.now()
let registerData = {
    "login": "jd" + timestamp,
    "password": "qwerty",
    "first name": "John",
    "last name": "Doe",
    "email": "jd" + timestamp + "@mail.com"
};

async function fillUpLoginData(driver, userDataJson){
    await driver.findElement(By.xpath("//*[@id='username']")).sendKeys(userDataJson["login"]);
    await driver.findElement(By.xpath("//*[@id='password']")).sendKeys(userDataJson["password"]);
}

async function fillUpRegisterData(driver, userDataJson){
    await driver.findElement(By.xpath("//*[@id='user_login']")).sendKeys(userDataJson["login"]);
    await driver.findElement(By.xpath("//*[@id='user_password']")).sendKeys(userDataJson["password"]);
    await driver.findElement(By.xpath("//*[@id='user_password_confirmation']")).sendKeys(userDataJson["password"]);
    await driver.findElement(By.xpath("//*[@id='user_firstname']")).sendKeys(userDataJson["first name"]);
    await driver.findElement(By.xpath("//*[@id='user_lastname']")).sendKeys(userDataJson["last name"]);
    await driver.findElement(By.xpath("//*[@id='user_mail']")).sendKeys(userDataJson["email"]);
}

// Test Redmine Register
async function register() {
    let driver =  await new Builder().forBrowser('chrome').setChromeOptions(/* ... */).build();

    await driver.get('http://demo.redmine.org')
    await driver.findElement(By.xpath("//*[@id='account']/descendant::*[@class='register']")).click();

    let regLoc = By.xpath("//*[@id='content']/descendant::h2[contains(text(),'Register')]");
    await driver.wait(until.elementLocated(regLoc), 5 * 1000);
    let regEl = driver.findElement(regLoc);
    

    await fillUpRegisterData(driver, registerData);
    await driver.findElement(By.xpath("//*[@name='commit']")).click();

    let mLoc = By.xpath("//*[@id='flash_notice' and text()='Your account has been activated. You can now log in.']");
    await driver.wait(until.elementLocated(mLoc), 5 * 1000);
    let mEl = driver.findElement(mLoc);
    

    await driver.findElement(By.xpath("//*[@name='commit']")).click();

    await driver.quit();

    console.log(`\n${arguments.callee.name} - OK`)
}


// Test Redmine Login
async function login() {
    let driver =  await new Builder().forBrowser('chrome').setChromeOptions(/* ... */).build();

    await driver.get('http://demo.redmine.org')
    await driver.findElement(By.xpath("//*[@id='account']/descendant::*[@class='login']")).click();

    let formLoc = By.xpath("//*[@id='content']/descendant::*[@id='login-form']");
    await driver.wait(until.elementLocated(formLoc), 5 * 1000);
    let formEl = driver.findElement(formLoc);



    await fillUpLoginData(driver, registerData);
    await driver.findElement(By.xpath("//*[@name='login']")).click();

    let lAsLoc = By.xpath("//*[@id='loggedas']")
    await driver.wait(until.elementLocated(lAsLoc), 5 * 1000);
    let lAsEl = driver.findElement(lAsLoc);

    let loggedasText = await lAsEl.getText();
    assert.equal(loggedasText, `Logged in as ${registerData["login"]}`, "Login Failed. Can't find User name in Logged as field");

    await driver.quit();

    console.log(`\n${arguments.callee.name} - OK`)
}

(async ()=> {
await register();
await login();

})();