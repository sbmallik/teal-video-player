'use strict';

const utils = require('../lib/utils.js');
const {
  PerformanceUtils, By, until, Eyes, Target, FixedCutProvider
} = require('../lib/constants.js');
let tools = require('../lib/methods.js');

jest.setTimeout(utils.TEST_TIMEOUT);

describe('Visual Test - ', function () {
  let /** @type {WebDriver} */ driver, /** @type {Eyes} */ eyes, testName, startDateIt;

  beforeEach(async function () {
    startDateIt = PerformanceUtils.start();
    const startDate = PerformanceUtils.start();
    startDate.start();
    driver = await tools.driverInit(testName.description);
    eyes = await tools.eyesInit();
    console.log(`beforeEach done in ${startDate.end().summary}`);
  });

  afterEach(async function () {
    const startDate = PerformanceUtils.start();
    startDate.start();
    await tools.updateSauce(driver, testName.description, testName.status());
    await driver.quit();
    console.log(`afterEach done in ${startDate.end().summary}`);
    console.log(`total time ${startDateIt.end().summary}`);
    expect(startDateIt.end().time).toBeLessThanOrEqual(utils.TEST_TIMEOUT);
  });

  testName = it('Page header element', async function () {
    const startDate = PerformanceUtils.start();

    const _driver = await eyes.open(driver, 'Eyes.SDK.JavaScript', testName.getFullName());
    console.log(`eyes.open done in ${startDate.end().summary}`);

    startDate.start();
    await _driver.get(utils.BASE_URL);
    console.log(`driver.get done in ${startDate.end().summary}`);

    startDate.start();
    await eyes.check(testName.description, Target.region(By.css('.gnt_n_w')));
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
  });

});
