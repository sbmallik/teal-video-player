# eyes-jest

***
## Test Framework

This repository contains the test code that executes *visual tests* for new _Tangent_ web pages. The JEST test runner is used (as this is used by developers as well). The visual testing will be performed by *Applitools*. The code uses Javascript, which in turn uses Selenium-Webdriver to deal with all user interactions with the web pages. *Sauce Labs* cloud based test platform is used to run the tests.

### Pre-requisites

* A Bourne-compatible shell, like bash or zsh (or knowledge to execute equivalent commands in your environment)
* [Git](http://gitscm.com/)
* [Node 10.15+](http://nodejs.org/)
* A Sauce Labs account. Please create a JIRA ticket with Component = 'account' for this purpose.

### Setup

Clone this GIT repository to the local machine as follows:
```
$ git clone git@github.com:sbmallik/eyes-jest.git
$ cd eyes-jest
```

The following step installs all dependent packages required by the test code. Please note the system configuration used in this repository is minimal and it was added inside `package.json` file.
```
$ npm install
```

### Environment variables used

Certain parameters such as authentication and other internal variables are obtained from the environment variables and these are listed below:

1. `SAUCE_USERNAME` - The username for the Sauce Labs account
1. `SAUCE_ACCESS_KEY` - The access key for the above account
1. `APPLITOOLS_API_KEY` - This key provides access to the Applitools Test Manager (and the Team within)
1. `APPLITOOLS_BATCH_ID` - This value is used to group the tests by a specific criteria (like browser, platform, test-name etc)
1. `APPLITOOLS_SERVER_URL` - This specifies the Applitools test manager URL
1. `USE_SAUCE_CONNECT` - This boolean variable, specifies the necessity of Sauce Connect

All these variables must be exported so that it allows all child processes to inherit. These are generally set inside the user profile.

### Running Tests

The test execution environment is either **local** or cloud based such as **Saucelabs**. In the former case the tests runs against a local `chromedriver` instance for desktop variant only. In case mobile environments are required to test the most viable way would be to use the latter option. This facilitates the use of virtual devices on which the tests can be executed.

The test execution occurs after all test files are generated at a particular location (per jest configuration file). The test files are generated based on the test data for each test. This reduces the complexity in the repository. The following command generates and executes all tests in sequence:
```
$ npm run test:visual
```
#### Runtime environment

Most of the time, the tests are executed in lower environments (such as development or staging) so that the bugs are caught during code development. However, such environment are generally behind the corporate firewall, which inhibits communication with Saucelabs based run time environments. test devices. The Sauce Connect tunnel provides a mean to run the tests in Saucelabs. The tunnel mechanism allows the above communication to proceed across the corporate firewall. If the test environment uses above feature the environment variable `USE_SAUCE_CONNECT` is set to `true`.

### NPM scripts

The following commands can be used for running and generating tests:
* `npm run test:visual`: Cleans test directory, generates all visual tests, and runs tests
* `npm run test:visual-generate`: Cleans test directory and generates visual tests. Use a command like `npm run test:visual-generate -- --tags tag1` to pass in parameters to the script.
* `npm run test:visual-no-generate`: Runs the existings tests in the test directory

Unfortunately the current way the generation works is that tests must be generated with the filters and then ran. Filtering after generation is left to Jest.

### Generating tests

Currently, the configuration file located at `test/visual/lib/test-configuration.js` is required and each configuration is ran through the template located at `test/visual/lib/test-template.js`.

#### Filtering tests

Filtering uses the test configuration and passed in parameters on the command line to filter tests to the liking of the user.

Filtering tests during generation can be done by `name`, `tags`, `only`, `ignoreTags`. All of these are properties on the test configuration object. Filtering strategies **can not** be combined meaning just one will be used if multiple are provided. The precedence is as follows: `only`, `name`, `tags`, `ignoreTags`. For example if `only` and `name` are specified then `only` will be used.

To generate a single test, specify the name like so
```
$ npm run test:visual-generate -- --name my-visual-test
```

To generate tests with tags specify the tags like so
```
$ npm run test:visual-generate -- --tags tag1
$ npm run test:visual-generate -- --tags tag1,tag2,tag3
```
To generate tests by ignoring some tags specify the ignoreTags like so
```
$ npm run test:visual-generate -- --ignoreTags tag1
$ npm run test:visual-generate -- --ignoreTags tag1,tags2,tag3
```

### Test Configuration

The test configuration is located in the file `test/visual/lib/test-configuration.js`.

The following properties are supported.

* `tags`
  * An array of strings for specify a group that the visual test belongs to
  * Example: `tags: ['module:hero3up', 'critical']`
* `name`
  * A string denoting the name of the test. This will be used to name the test in applitools and the name of the file.
  * Must be unique
  * Example: `name: 'hero-3-up-variant-a`
* `urlEnding`
  * A string that is postfixed to the configured base url
  * Example: `urlEnding: '/?gnt-test-alert=off&gnt-test-hero3up=variant-c'`
* `defaultSelectorValue`
  * A string that is used whenever a selector value is required. Can be overriden by individual selector values.
  * `defaultSelectorValue: '.gnt_m_hero`
* `selector`
  * An object containing information for how to select the element to snapshot for the visual test
* `selector.function`
  * A string that is used to denote the function format the selector using the selenium `By` object
  * Example: `function: `selector: 'By.css'`
* `selector.value`
  * A string that is used as the parameter to the `selector.function` defined above
  * Defaults to `defaultSelectorValue`
  * Example: `value: '.gnt_m_hero_3up'`
* `scrollToViewElement`
  * An object containing information on which element wait for and which element to scroll the browser to view
* `scrollToViewElement.function`
  * A string that is used to denote the function to format the selector using the selenium `By` object
  * This is for the element to wait for
  * Example: `function: `selector: 'By.css'`
* `scrollToViewElement.value`
  * A string that is used as the parameter to the `scrollToViewElement.function` defined above
  * This is for the element to wait for
  * Defaults to `defaultSelectorValue`
  * Example: `value: '.gnt_m_hero_3up'`
* `scrollToViewElement.documentFunction`
  * A string that is used to denote the function to format the selector in using the browser `document` object
  * This is for the scroll to element script
  * Example: `documentFunction: 'querySelector'`
* `scrollToViewElement.documentValue`
  * A string that is used as the parameter to the `scrollToViewElement.documentFunction`
  * This is for the scroll to element script
  * Defaults to `defaultSelectorValue`
  * Example: `documentValue: 'div.gnt_m.gnt_m_mpop'`
* `waitBeforeScreenshot`
  * Time in milliseconds to wait before applitools takes a screenshot
  * Defaults to no wait
  * Example: `waitBeforeScreenshot: 10000`


### Jest Configuration file

Please check the configuration file at `test/visual/jestVisualConfig.json` for options used when Jest is ran.

The configuration file sets the folder and filename format for the tests. All test file names should be formatted as follows: `*.visual.test.js`. By default all console outputs other than errors are suppressed. The parallel execution are set to default, unless specifically overridden per the CI environment.

This repository will be used for demonstration purpose only - therefore no *Continuous Integration* code (Jenkins Pipeline for example) was added.
