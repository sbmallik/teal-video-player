'use strict';

const {
        Builder, By, until, ConsoleLogHandler, Eyes, FixedCutProvider, MatchLevel, CorsIframeHandle,
        VisualGridRunner, BrowserType, ChromeOptions,
        DeviceName, ScreenOrientation
      } = require('./constants.js'),
      SauceLabs = require('saucelabs'),
      username = process.env.SAUCE_USERNAME,
      password = process.env.SAUCE_ACCESS_KEY,
      applitoolsServerUrl = 'https://gannetteyes.applitools.com',
      apiKey = process.env.APPLITOOLS_API_KEY,
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
    eyes.setMatchLevel(MatchLevel.Layout2);
    eyes.setForceFullPageScreenshot(false);
    eyes.setBatch(`tangent-${process.env.UNIQUE_ID}`, process.env.UNIQUE_ID, process.env.TEST_SETUP_TIME);
    eyes.setApiKey(apiKey);
    eyes.setServerUrl('https://gannetteyes.applitools.com');
    process.env.APPLITOOLS_SERVER_URL='https://gannetteyes.applitools.com';
    return eyes;
  },
  async eyesVisualGridInit() {
    let concurrentSessions = 4,
        eyes = await new Eyes(new VisualGridRunner(concurrentSessions));
    eyes.setLogHandler(await new ConsoleLogHandler(true));
    eyes.setMatchLevel(MatchLevel.Layout2);
    eyes.setCorsIframeHandle(CorsIframeHandle.BLANK);
    eyes.setBatch(`tangent-${process.env.UNIQUE_ID}`, process.env.UNIQUE_ID, process.env.TEST_SETUP_TIME);
    eyes.setApiKey(apiKey);
    eyes.setServerUrl('https://gannetteyes.applitools.com');
    eyes.MatchTimeout = 10;
    process.env.APPLITOOLS_SERVER_URL='https://gannetteyes.applitools.com';
    return eyes;
  },
  setVisualGridConfig(eyes) {
    eyes.setHideScrollbars(true);
    eyes.setForceFullPageScreenshot(false);
    const config = eyes.getConfiguration();
// Define the visual grid configurations here
// More details are listed here: https://raw.githubusercontent.com/chromium/chromium/0aee4434a4dba42a42abaea9bfbc0cd196a63bc1/third_party/blink/renderer/devtools/front_end/emulated_devices/module.json
    config.addBrowser(1280, 960, BrowserType.CHROME);
    config.addBrowser(1280, 960, BrowserType.FIREFOX);
//    config.addDeviceEmulation(DeviceName.iPhone_4, ScreenOrientation.PORTRAIT);
    return config;
  },
  remoteDriverInit(testName) {
    // add code here to update env ver USE_SAUCE_CONNECT
    let driver = new Builder().withCapabilities(JSON.parse(process.env.CAPS)).usingServer(seleniumUrl).build();
    driver.getSession().then(function(sessionid) {
      driver.sessionID = sessionid.id_;
      console.log(`SauceOnDemandSessionID = ${driver.sessionID}, Test name = ${testName}`);
    });
    return driver;
  },
  async driverInit() {
    // add code here to update env ver USE_SAUCE_CONNECT
    let driver = await new Builder().forBrowser('chrome').setChromeOptions(new ChromeOptions().headless()).build();
    await driver.manage().window().setRect({
      width: 1280,
      height: 960
    });
    return driver;
  },
  async checkAlertBanner(driver) {
    await driver.findElement(By.css(ALERT_BANNER)).then(async function(element) {
      if (element) {
        await driver.findElement(By.css(ALERT_CLOSE_BUTTON)).click();
      }
    }).catch(function(err) {
      console.log(err);
    });
  },
  async suppressElement(driver, selector) {
    await driver.wait(until.elementLocated(By.css(selector + ' iframe[data-load-complete="true"]')), ELEMENT_TIMEOUT).then(async function(element) {
      await driver.wait(until.elementIsVisible(element), ELEMENT_TIMEOUT);
    });
    await driver.executeScript(function(pageElement) {
      document.querySelector(pageElement).setAttribute('style', 'display:none');
    }, [selector]);
  },
  updateSauce(driver, testName, testStatus) {
    driver.getSession().then(function(session) {
      console.log(`SauceOnDemandSessionID= + ${session.id_}, Test name = ${testName}, Test status = ${testStatus}`);
      saucelabs.updateJob(session.id_, {
        passed: testStatus === 'passed',
        name: testName
      }, function() {});
    });
  },
  async validateLegacyResult(eyes) {
    await eyes.close(false).then((result) => {
      if (result.getIsNew()) {
        console.log(`New baseline created: URL = ${result._appUrls._session}`);
      } else {
        expect(result.getMismatches()).toBe(0);
      }
    });
  }
};
