module.exports = {

    'Demo test Ecosia.org': function (browser) {
        browser
            .url('https://www.ecosia.org/')
            .waitForElementVisible('body')
            .assert.titleContains('Ecosia')
            .assert.visible('input[type=search]')
            .setValue('input[type=search]', 'nightwatch')
            .assert.visible('button[type=submit]')
            .click('button[type=submit]')
            .assert.containsText('.mainline-results', 'Nightwatch.js')
            .end();
    },

    'Demo simple test xpath': async function (browser) {
        await browser.url('https://nightwatchjs.org/');
        await browser.useXpath();

        await browser.waitForElementVisible('//*[@id="navbar"]/descendant::a[text()="Developer Guide"]');
        await browser.click('//*[@id="navbar"]/descendant::a[text()="Developer Guide"]');
        await browser.waitForElementVisible('//a[text()="Using Xpath"]');
        await browser.click('//a[text()="Using Xpath"]');
        await browser.pause(1000);
        await browser.assert.containsText('(//*[@id="using-xpath-selectors"]/following-sibling::p)[1]',
            'Nightwatch supports xpath selectors also.');
        await browser.useCss();
        await browser.end();
    },

    'Demo test Google': function (browser) {
        browser
            .url('https://www.google.com')
            .pause(3000)
            .waitForElementVisible('body')
            .setValue('input[type=text]', 'nightwatch')
            .waitForElementVisible('input[name=btnK]')
            .click('input[name=btnK]')
            .pause(1000)
            .assert.containsText('#main', 'Night Watch')
            .end();
    },

    'Demo test Google Assert': function (browser) {
        browser
            .url('https://google.com')
            .pause(3000);

        // expect element <body> to be present in 1000ms
        browser.expect.element('body').to.be.present
        // expect element <#lst-ib> to have css property 'display'
        browser.expect.element('input[name=q]').to.have.css('display');

        // expect element <body> to have attribute 'class' which contains text 'vasq'
        browser.expect.element('body').to.have.attribute('class').which.contains('vasq');

        // expect element <#lst-ib> to be an input tag
        browser.expect.element('[name=q]').to.be.an('input');

        // expect element <#lst-ib> to be visible
        browser.expect.element('[name=q]').to.be.visible;

        browser.end();
    }
};