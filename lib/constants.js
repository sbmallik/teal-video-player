'use strict';

const { Builder, By, until } = require('selenium-webdriver');
const { ConsoleLogHandler, PerformanceUtils } = require('@applitools/eyes-common');
const { Eyes, Target } = require('@applitools/eyes-selenium');
const FixedCutProvider =  require('@applitools/eyes-sdk-core').FixedCutProvider;
const MatchLevel =  require('@applitools/eyes-sdk-core').MatchLevel;
const SauceLabs = require('saucelabs');

module.exports = Object.freeze({
  Builder, By, until, ConsoleLogHandler, PerformanceUtils, Eyes, Target, FixedCutProvider, MatchLevel, SauceLabs
});
