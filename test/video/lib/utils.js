'use strict';

const {Builder, By, until, ChromeOptions} = require('./constants.js'),
      config = require('config'),
      SauceLabs = require('saucelabs'),
      username = config.get('test.api.sauce.user'),
      password = config.get('test.api.sauce.key'),
      seleniumUrl = `http://${username}:${password}@ondemand.saucelabs.com:4444/wd/hub`,
      saucelabs = new SauceLabs({
        username,
        password
      });

module.exports = {
  async remoteDriverInit(testName) {
    // add code here to update env ver USE_SAUCE_CONNECT
    let driver = await new Builder().withCapabilities(JSON.parse(global.capabilities)).usingServer(seleniumUrl).build();
    await driver.getSession().then((sessionid) => {
      driver.sessionID = sessionid.getId();
      console.log(`SauceOnDemandSessionID = ${driver.sessionID}, Test name = ${testName}`);
    });
    return driver;
  },
  async driverInit() {
    // add code here to update env ver USE_SAUCE_CONNECT
    let driver = await new Builder().forBrowser('chrome').setChromeOptions(new ChromeOptions().setMobileEmulation({
      deviceName: 'Pixel 2'
    }).headless()).build();
    await driver.manage().window().setRect({
      width: 375,
      height: 812
    });
    return driver;
  },
  async suppressElement(driver, selector) {
    await driver.wait(until.elementLocated(By.css(selector + ' iframe[data-load-complete="true"]')), ELEMENT_TIMEOUT).then(async function waitForElementDisplay(element) {
      await driver.wait(until.elementIsVisible(element), ELEMENT_TIMEOUT);
    });
    await driver.executeScript((pageElement) => {
      document.querySelector(pageElement).setAttribute('style', 'display:none');
    }, [selector]);
  },
  updateSauce(driver, testName, testStatus) {
    driver.getSession().then((session) => {
      console.log(`SauceOnDemandSessionID= + ${session.getId()}, Test name = ${testName}, Test status = ${testStatus}`);
      saucelabs.updateJob(session.getId(), {
        passed: testStatus === 'passed',
        name: testName
      }, () => {});
    });
  },
  async validateLegacyResult(eyes) {
    await eyes.close(false).then((result) => {
      if (result.getIsNew()) {
        console.log(`New baseline created: URL = ${result.getAppUrls().getSession()}`);
      } else {
        expect(result.getMismatches()).toBe(0);
      }
    });
  }
};
