'use strict';

const {
        Builder, By, until, ConsoleLogHandler, Eyes, MatchLevel, CorsIframeHandle,
        VisualGridRunner, BrowserType, DeviceName, ScreenOrientation, ChromeOptions
      } = require('./constants.js'),
      config = require('config'),
      SauceLabs = require('saucelabs'),
      username = config.get('test.api.sauce.user'),
      password = config.get('test.api.sauce.key'),
      apiKey = config.get('test.api.applitools.key'),
      seleniumUrl = `http://${username}:${password}@ondemand.saucelabs.com:4444/wd/hub`,
      saucelabs = new SauceLabs({
        username,
        password
      });

module.exports = {
  eyesLegacyInit() {
    let eyes = new Eyes();
    eyes.setLogHandler(new ConsoleLogHandler(false));
    eyes.setSendDom(false);
    eyes.setHideScrollbars(true);
    eyes.setMatchLevel(MatchLevel.Layout);
    eyes.setForceFullPageScreenshot(false);
    eyes.setBatch(`uw-${process.env.UNIQUE_ID}`, process.env.UNIQUE_ID, process.env.TEST_SETUP_TIME);
    eyes.setApiKey(apiKey);
    eyes.setServerUrl(config.get('test.api.applitools.endpoint'));
    eyes.setMatchTimeout(30000);
    return eyes;
  },
  async eyesVisualGridInit() {
    let concurrentSessions = 4,
        eyes = await new Eyes(new VisualGridRunner(concurrentSessions));
    eyes.setLogHandler(await new ConsoleLogHandler(false));
    eyes.setMatchLevel(MatchLevel.Layout);
    eyes.setCorsIframeHandle(CorsIframeHandle.BLANK);
    eyes.setBatch(`uw-${process.env.UNIQUE_ID}`, process.env.UNIQUE_ID, process.env.TEST_SETUP_TIME);
    eyes.setApiKey(apiKey);
    eyes.setForceFullPageScreenshot(false);
    eyes.setServerUrl(config.get('test.api.applitools.endpoint'));
    eyes.setMatchTimeout(30000);
    return eyes;
  },
  setVisualGridConfig(eyes) {
    eyes.setHideScrollbars(true);
    eyes.setForceFullPageScreenshot(false);
    const config = eyes.getConfiguration();
    // Define the visual grid configurations here
    // More details are listed here: https://raw.githubusercontent.com/chromium/chromium/0aee4434a4dba42a42abaea9bfbc0cd196a63bc1/third_party/blink/renderer/devtools/front_end/emulated_devices/module.json
//    config.addBrowser(1280, 960, BrowserType.CHROME);
//    config.addBrowser(1280, 960, BrowserType.FIREFOX);
    config.addDeviceEmulation(DeviceName.iPhone_X, ScreenOrientation.PORTRAIT);
    config.addDeviceEmulation(DeviceName.Pixel_2, ScreenOrientation.PORTRAIT);
//    config.addDeviceEmulation(DeviceName.Nokia_N9, ScreenOrientation.PORTRAIT);
    return config;
  },
  remoteDriverInit(testName) {
    // add code here to update env ver USE_SAUCE_CONNECT
    let driver = new Builder().withCapabilities(JSON.parse(process.env.CAPS)).usingServer(seleniumUrl).build();
    driver.getSession().then((sessionid) => {
      driver.sessionID = sessionid.getId();
      console.log(`SauceOnDemandSessionID = ${driver.sessionID}, Test name = ${testName}`);
    });
    return driver;
  },
  async driverInit() {
    // add code here to update env ver USE_SAUCE_CONNECT
    let driver = await new Builder().forBrowser('chrome').setChromeOptions(new ChromeOptions().setMobileEmulation({deviceName: 'Pixel 2'}).headless()).build();
//    let driver = await new Builder().forBrowser('chrome').setChromeOptions(new ChromeOptions().setMobileEmulation({deviceName: 'Pixel 2'})).build();
    await driver.manage().window().setRect({
      width: 375,
      height: 812
    });
    return driver;
  },
  async checkAlertBanner(driver) {
    await driver.findElement(By.css(ALERT_BANNER)).then(async(element) => {
      if (element) {
        await driver.findElement(By.css(ALERT_CLOSE_BUTTON)).click();
      }
    }).catch((err) => {
      console.log(err);
    });
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
