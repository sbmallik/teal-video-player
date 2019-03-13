'use strict';

const {
  PerformanceUtils, By, until, Eyes, Target, FixedCutProvider,
  HIGH_IMPACT_AD, BASE_URL, TEST_TIMEOUT, ELEMENT_TIMEOUT
} = require('../lib/constants.js');
const tools = require('../lib/utils.js');

jest.setTimeout(TEST_TIMEOUT);

describe('Visual Test - ', function () {
  let /** @type {WebDriver} */ driver, /** @type {Eyes} */ eyes, testName, startDateIt;

  beforeEach(async (done) => {
    startDateIt = PerformanceUtils.start();
    const startDate = PerformanceUtils.start();
    startDate.start();
    driver = await tools.driverInit(testName.description);
    eyes = await tools.eyesInit();
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

  testName = it('Hero-3-up element', async (done) => {
    const startDate = PerformanceUtils.start();

    const _driver = await eyes.open(driver, 'Eyes.SDK.JavaScript', testName.getFullName());
    console.log(`eyes.open done in ${startDate.end().summary}`);

    startDate.start();
    await _driver.get(BASE_URL);
    console.log(`driver.get done in ${startDate.end().summary}`);

    startDate.start();
    await _driver.findElement(By.css(HIGH_IMPACT_AD)).then(async function(element) {
      await _driver.wait(until.elementIsVisible(element), ELEMENT_TIMEOUT);
    });
    await _driver.executeScript(function(pageElement) {
      document.querySelector(pageElement).setAttribute('style', 'display:none')
    }, [HIGH_IMPACT_AD]);
    console.log(`High impact AD element was detected and disabled in ${startDate.end().summary}`);

    startDate.start();
    await eyes.check(testName.description, Target.region(By.css('.gnt_m_hero')));
    console.log(`eyes.check done in ${startDate.end().summary}`);

    startDate.start();
    await eyes.close(false).then((result) => {
      if (result._isNew) {
        console.log(`New baseline created: URL = ${result._appUrls._session}`);
      } else {
        expect(result._mismatches).toBe(0);
      }
    });
    console.log(`eyes.close done in ${startDate.end().summary}`);
    done();
  });

});
