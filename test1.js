const webdriver = require('selenium-webdriver');

let driver = new webdriver.Builder()
    .forBrowser('chrome')
    .setChromeOptions(/* ... */)
    .build();

// Test Google Hello World

driver.get('http://www.google.com').then(function () {
    return driver.findElement(webdriver.By.xpath("//*[@name='q']")).sendKeys('hello world', webdriver.Key.RETURN);
}).then(function () {
    return driver.wait(webdriver.until.titleContains('hello world'), 1000);
}).then(function () {
    return driver.quit();
});
