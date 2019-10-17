'use strict';
  
const {Builder, By, until} = require('selenium-webdriver'),
      {Options: ChromeOptions} = require('selenium-webdriver/chrome'),
      capabilities = {
        desktopChrome: {
          browserName: 'chrome',
          version: '77',
          platform: 'macOS 10.14',
          screenResolution: '1600x1200'
        },
        desktopFirefox: {
          browserName: 'firefox',
          version: '69',
          platform: 'Windows 10',
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
      };

module.exports = Object.freeze({
  Builder,
  By,
  until,
  ChromeOptions,
  capabilities
});
