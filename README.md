# Teal video player

***

## Test Framework

This repository contains the test code that executes **video tests** with the **Teal Player** for new _Tangent_ web pages. The JEST test runner is used as this is stadardized for testing. The code uses NodeJS, which in turn uses Selenium-Webdriver to deal with all user interactions with the web pages. *Sauce Labs* cloud based test platform is used to run the tests.

### Pre-requisites

* A Bourne-compatible shell, like bash or zsh (or knowledge to execute equivalent commands in your environment)
* [Git](http://gitscm.com/)
* [Node 10.15+](http://nodejs.org/)
* A Sauce Labs account. Please create a JIRA ticket with Component = 'account' for this purpose.

### Setup

Clone this GIT repository to the local machine as follows:

```javascript
git clone git@github.com:sbmallik/eyes-jest.git
cd eyes-jest
```

The following step installs all dependent packages required by the test code. Please note the system configuration used in this repository is minimal and it was added inside `package.json` file.

```javascript
npm install
```

### Environment variables used

Certain parameters such as authentication and other internal variables are obtained from the environment variables and these are listed below:

Name | Description
-----|------------
`SAUCE_USERNAME` | The username for the Sauce Labs account
`SAUCE_ACCESS_KEY` | The access key for the above account
`USE_SAUCE_CONNECT` | This boolean variable, specifies the necessity of Sauce Connect

All these variables must be exported so that it allows all child processes to inherit. These are generally set inside the user profile.

## Running Tests

The test execution environment is either **local** or cloud based such as **Saucelabs**. In the former case the tests runs against a local `chromedriver` instance for desktop variant only. In case mobile environments are required to test the most viable way would be to use the latter option. This facilitates the use of virtual devices on which the tests can be executed.

The test execution occurs after all test files are generated at a particular location (per jest configuration file). The test files are generated based on the test data for each test. This reduces the complexity in the repository. The following command generates and executes all tests in sequence:

```javascript
npm run test:video
```

The test environment can be specified in the above command using the environment variable *NODE_ENV*. Generally this is set to `development-east` so that the application's development environment is used.

### Runtime environment

Most of the time, the tests are executed in lower environments (such as development or staging) so that the bugs are caught during code development. However, such environment are generally behind the corporate firewall, which inhibits communication with Saucelabs based run time environments. test devices. The Sauce Connect tunnel provides a mean to run the tests in Saucelabs. The tunnel mechanism allows the above communication to proceed across the corporate firewall. If the test environment uses above feature the environment variable `USE_SAUCE_CONNECT` is set to `true`.

### NPM scripts

The following commands can be used for running and generating tests:

```javascript
npm run test:video
```

In addition linting of test files can be performed using the command:

```javascript
npm run test:lint
```

### Filtering tests

Filtering uses the test configuration and passed in parameters on the command line to filter tests to the liking of the user. To generate a single test, specify the name like so

```javascript
npm run test:visual-generate -- -t <test-name>
```

### Jest Configuration file

Please check the configuration file at `test/video/jestVideoConfig.json` for options used when Jest is ran.

The configuration file sets the folder and filename format for the tests. All test file names should be formatted as follows: `*.video.test.js`. By default all console outputs other than errors are suppressed. The parallel execution are set to default, unless specifically overridden per the CI environment.

This repository will be used for demonstration purpose only - therefore no *Continuous Integration* code (Jenkins Pipeline for example) was added.
