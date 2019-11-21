//conf.js
exports.config = {
  framework: 'jasmine',
  // seleniumAddress: 'http://localhost:4444/wd/hub',
  directConnect: true,

  capabilities: {
    browserName: 'chrome',
    chromeOptions: {
      args: [
        //'--remote-debugging-port=9222',
        //'--start-maximized',
        //'--incognito',
        //'--headless',
        '--test-type',
        '--disable-extensions',
        '--enable-crash-reporter-for-testing',
        '--no-sandbox',
        '--disable-infobars',
        '--disable-gpu'
      ]
    },
    loggingPrefs: {
      browser: 'ALL'
    }
  },
  specs: ['spec.js'],

  onPrepare: function () {

    const JasmineConsoleReporter = require('jasmine-console-reporter');
    const reporter = new JasmineConsoleReporter({
        colors: 1,           // (0|false)|(1|true)|2
        cleanStack: 1,       // (0|false)|(1|true)|2|3
        verbosity: 4,        // (0|false)|1|2|(3|true)|4|Object
        listStyle: 'indent', // "flat"|"indent"
        timeUnit: 'ms',      // "ms"|"ns"|"s"
        timeThreshold: { ok: 500, warn: 1000, ouch: 3000 }, // Object|Number
        activity: false,     // boolean or string ("dots"|"star"|"flip"|"bouncingBar"|...)
        emoji: true,
        beep: true
    });

    // add jasmine-spec-reporter
    jasmine.getEnv().addReporter(reporter);
  }
}