'use strict';

const {
  PerformanceUtils, By, until, Eyes, Target, FixedCutProvider,
  HIGH_IMPACT_AD, TOP_POSTER_AD, POSTER_SCROLL_AD, BASE_URL, TEST_TIMEOUT, ELEMENT_TIMEOUT
} = require('../lib/constants.js');
let tools = require('../lib/utils.js');

jest.setTimeout(TEST_TIMEOUT);

describe('Visual Test - ', function () {
  let /** @type {WebDriver} */ driver, /** @type {Eyes} */ eyes, testName, startDateIt;

  beforeEach(async (done) => {
    startDateIt = PerformanceUtils.start();
    const startDate = PerformanceUtils.start();
    startDate.start();
    driver = await tools.driverInit(testName.description);
    eyes = await tools.eyesInit();
    eyes.setForceFullPageScreenshot(true);
    console.log(`beforeEach done in ${startDate.end().summary}`);
    done();
  });

  afterEach(async (done) => {
    const startDate = PerformanceUtils.start();
    startDate.start();
    await tools.updateSauce(driver, testName.description, testName.status());
    await driver.quit();
    console.log(`afterEach done in ${startDate.end().summary}`);
    console.log(`total time ${startDateIt.end().summary}`);
    expect(startDateIt.end().time).toBeLessThanOrEqual(TEST_TIMEOUT);
    done();
  });

  testName = test.skip('Full Page', async (done) => {
    const startDate = PerformanceUtils.start();

    const _driver = await eyes.open(driver, 'Eyes.SDK.JavaScript', testName.getFullName());
    console.log(`eyes.open done in ${startDate.end().summary}`);

    startDate.start();
    await _driver.get(BASE_URL);
    console.log(`driver.get done in ${startDate.end().summary}`);

    startDate.start();
    await tools.checkAlertBanner(_driver);
    console.log(`Alert banner check completed in ${startDate.end().summary}`);

    startDate.start();
    await tools.suppressElement(_driver, HIGH_IMPACT_AD);
    console.log(`High impact AD element was detected and disabled in ${startDate.end().summary}`);

    startDate.start();
    await tools.suppressElement(_driver, TOP_POSTER_AD);
    console.log(`Top poster AD element was detected and disabled in ${startDate.end().summary}`);

    startDate.start();
    await _driver.executeScript("window.scrollBy(0, 4 * window.innerHeight)");
    await tools.suppressElement(_driver, POSTER_SCROLL_AD);
    console.log(`Poster scroll AD element was detected and disabled in ${startDate.end().summary}`);

    // Trim the page header for full page screenshot
    startDate.start();
    await eyes.setImageCut(new FixedCutProvider(121, 0, 0, 0));
    console.log(`eyes.setImageCut done in ${startDate.end().summary}`);

    startDate.start();
    await eyes.check(testName.description, Target.window());
    console.log(`eyes.check done in ${startDate.end().summary}`);

    startDate.start();
    await tools.validateResults(eyes);
    console.log(`eyes.close done in ${startDate.end().summary}`)
    done();
  });

});
