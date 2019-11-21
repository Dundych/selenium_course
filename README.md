# selenium_course
examples to learn selenium

## To install dependencies
- install latest LTS version of node https://nodejs.org/uk/
- navigate to project folder and install dependencies
```sh
$ npm install
```
## To run examples

- run example script
```sh
$ node examples/promise/p_ex_1.js
```

- run selenium test
```sh
$ node examples/test/test1.js
```

## To run simple js tests

- run jasmine example
```sh
$ ./node_modules/.bin/jasmine --reporter=jasmine-console-reporter examples/test_jasmine/test*.js
```
or
```sh
$ npx jasmine --reporter=jasmine-console-reporter examples/test_jasmine/test*.js
```

- run cucumber example
```sh
$ npx cucumber-js examples/test_cucumber/features
```

- run mocha example
```sh
$ npx mocha examples/test_mocha
```

- run jest example
```sh
$ npx jest --testTimeout=10000 --testMatch **/examples/test_jest/test1.js
```

## To run framework tests

- run protractor tests
```sh
$ npx webdriver-manager clean
$ npx webdriver-manager update --versions.chrome=77.0.3865.10
$ npx protractor examples/test_protractor/conf.js
```

- run nightwatch tests
```sh
$ npx nightwatch -c examples/test_nightwatch/nightwatch.json
```

- run webdriver io tests
```sh
$ npx wdio config
$ npx wdio examples/test_wdio/wdio.conf.js
```

- run nightmare tests
```sh
$ node examples/test_nightmare/example.js
$ npx mocha examples/test_nightmare/test1.js
```