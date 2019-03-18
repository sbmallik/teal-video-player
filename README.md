# eyes-jest

***
## Test Framework

This repository contains the test code that executes *visual tests* for new _Tangent_ web pages. The JEST test runner is used (as this is used by developers as well). The visual testing will be performed by *Applitools*. The code uses Javascript, which in turn uses Selenium-Webdriver to deal with all user interactions with the web pages. *Sauce Labs* cloud based test platform is used to run the tests.

### Pre-requisites

* A Bourne-compatible shell, like bash or zsh (or knowledge to execute equivalent commands in your environment)
* [Git](http://gitscm.com/)
* [Node 8.9+](http://nodejs.org/)
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

All these variables must be exported so that it allows all child processes to inherit. These are generally set inside the user profile.

### Running Tests

By default Jest tests runs against a local `chromedriver`, but in the current repository local execution isn't supported at the moment. Instead the tests are executed remotely in Sauce Labs cloud based environment. At the moment this is supported for desktop environment only and the initial release will support Chrome browser.

The following test execution options are available:

#### Run all tests

The following command executes all test files having names like `*.test.js`.
```
$ npm test -- --detectOpenHandles
```

#### Filtering tests

To run a single test, simply add the test in the command line as follows:
```
$ npm test -- -t <test-name>
```
The `test-name` is the name of the test file to run. The test file name should comply to any qualifiers specified in the configuration.

In order to filter tests by filename a flag is added that accepts a regular expression of the `test-spec`. Please note this can be the name string located in either `describe` or `it` blocks. Therefore the command gets modified to:
```
$ npm test -- --detectOpenHandles -t="<reguar-expression>"
```

#### Disabling the code output

Optionally the test logs can be disabled (with the exception of errors) by using this flag:
```
$ npm test -- --detectOpenHandles --silent
```

#### Parallel execution

An easy way to set the parallel test execution is to ignore the cache as mentioned in this [issue link](https://github.com/facebook/jest/issues/5818). By default the cache is used and the tests are executed sequentially. This is achieved by using a command line parameter as below:
```
$ npm test -- --detectOpenHandles --no-cache
```

This repository will be used for demonstration pupose only - therefore no *Continuous Integration* code (Jenkins Pipeline for example) was added.
