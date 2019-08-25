'use strict';
  
const {Builder, By, until} = require('selenium-webdriver'),
      {Options: ChromeOptions} = require('selenium-webdriver/chrome'),
      {ConsoleLogHandler, PerformanceUtils, BatchInfo} = require('@applitools/eyes-common'),
      {Eyes, Target, BrowserType, DeviceName, ScreenOrientation, VisualGridRunner} = require('@applitools/eyes-selenium'),
      {FixedCutProvider, MatchLevel, CorsIframeHandle} =  require('@applitools/eyes-sdk-core'),
      capabilities = {
        desktopChrome: {
          browserName: 'chrome',
          version: '66',
          platform: 'macOS 10.12',
          screenResolution: '1600x1200'
        },
        androidChrome: {
          appiumVersion: '1.9.1',
          deviceName: 'Samsung Galaxy S9 HD GoogleAPI Emulator',
          deviceOrientation: 'portrait',
          browserName: 'Chrome',
          platformVersion: '8.1',
          platformName: 'Android'
        },
        iosSafari: {
          appiumVersion: '1.9.1',
          deviceName: 'iPhone X Simulator',
          deviceOrientation: 'portrait',
          browserName: 'Safari',
          platformVersion: '11.2',
          platformName: 'iOS'
        }
      },
      TEST_TIMEOUT = 5 * 60 * 1000;

module.exports = Object.freeze({
  Builder,
  By,
  until,
  ConsoleLogHandler,
  PerformanceUtils,
  BatchInfo,
  VisualGridRunner,
  Eyes,
  Target,
  BrowserType,
  DeviceName,
  ScreenOrientation,
  FixedCutProvider,
  MatchLevel,
  CorsIframeHandle,
  ChromeOptions,
  capabilities,
  TEST_TIMEOUT
});
