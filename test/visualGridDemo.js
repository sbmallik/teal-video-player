'use strict';

const {
  Builder, By, until,
  Eyes, Target, SeleniumConfiguration, BrowserType, ScreenOrientation,
  ConsoleLogHandler, BatchInfo, MatchLevel, FixedCutProvider,
  batchNumber, apiKey, capabilities, seleniumUrl, ChromeOptions, saucelabs, TEST_TIMEOUT
} = require('../lib/constants.js');
const tools = require('../lib/utils.js');

describe('Visual Test', function () {
  let /** @type {WebDriver} */ driver, /** @type {Eyes} */ eyes, testName;

  jest.setTimeout(TEST_TIMEOUT);

  beforeEach(async (done) => {
    driver = await new Builder().forBrowser('chrome').setChromeOptions(new ChromeOptions().headless()).build();
//    driver = await tools.driverInit(testName.description);
    done();
  });

  testName = it('Visual Grid Demo', async (done) => {
    eyes = await tools.eyesVisualGridInit();

    const configuration = new SeleniumConfiguration();
    configuration.setTestName('Visual Grid Demo');
    configuration.setAppName('Eyes.SDK.JavaScript');
    configuration.setHideScrollbars(true);
    configuration.setForceFullPageScreenshot(false);

// Define the visual grid configurations here
// More details are listed here: https://raw.githubusercontent.com/chromium/chromium/0aee4434a4dba42a42abaea9bfbc0cd196a63bc1/third_party/blink/renderer/devtools/front_end/emulated_devices/module.json

    configuration.addBrowser(1024, 840, BrowserType.CHROME);
    configuration.addBrowser(1280, 1024, BrowserType.FIREFOX);
    configuration.addDevice('Nexus 5X', ScreenOrientation.PORTRAIT);
    configuration.addDevice('iPhone X', ScreenOrientation.PORTRAIT);

// Run the test once and Applitools interface will render the DOM to the visual grid

    const _driver = await eyes.open(driver, configuration);
    await _driver.get('https://applitools.github.io/demo/TestPages/VisualGridTestPage');
    await eyes.check('viewport', Target.window());
    await eyes.close();
    done();
  });

  afterEach(async (done) => {
//    await tools.updateSauce(driver, testName.description, testName.status());
    if (driver != null) {
      await driver.quit();
    }
    done();
  });
});
