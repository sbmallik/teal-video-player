'use strict';

const { Builder, By, until } = require('selenium-webdriver');
const { ConsoleLogHandler, PerformanceUtils } = require('@applitools/eyes-common');
const { Eyes, Target } = require('@applitools/eyes-selenium');
const FixedCutProvider =  require('@applitools/eyes-sdk-core').FixedCutProvider;
const MatchLevel =  require('@applitools/eyes-sdk-core').MatchLevel;
const SauceLabs = require('saucelabs');

const username = process.env.SAUCE_USERNAME;
const password = process.env.SAUCE_ACCESS_KEY;
const batchNumber = process.env.APPLITOOLS_BATCH_ID;
const seleniumUrl = `http://${username}:${password}@ondemand.saucelabs.com:4444/wd/hub`;

const capabilities = {
  'browserName': 'chrome',
  'version': '66',
  'platform': 'macOS 10.12',
  'screenResolution': '1600x1200'
};
const saucelabs = new SauceLabs({
  username: username,
  password: password
});

jest.setTimeout(10 * 60 * 1000);

describe('Visual Test - ', function () {
  let /** @type {WebDriver} */ driver, /** @type {Eyes} */ eyes, testName, startDateIt;

  beforeEach(async function () {
    startDateIt = PerformanceUtils.start();
    const startDate = PerformanceUtils.start();
    startDate.start();

    driver = await new Builder().withCapabilities(capabilities).usingServer(seleniumUrl).build();
    driver.getSession().then(function(sessionid) {
      driver.sessionID = sessionid.id_;
      console.log(`SauceOnDemandSessionID = ${driver.sessionID}, Test name = ${testName.description}`);
    });

    eyes = new Eyes();
    eyes.setLogHandler(new ConsoleLogHandler(false));
    eyes.setSendDom(false);
    eyes.setHideScrollbars(true);
    eyes.setMatchLevel(MatchLevel.Level2);
    eyes.setForceFullPageScreenshot(false);
    eyes.setBatch('tangent-visual-tests-' + batchNumber, batchNumber || Date.now());
    console.log(`beforeEach done in ${startDate.end().summary}`);
  });

  afterEach(async function () {
    const startDate = PerformanceUtils.start();
    driver.getSession().then(function(session) {
      console.log(`SauceOnDemandSessionID= + ${session.id_}, Test name = ${testName.description}, Test status = ${testName.status()}`);
      saucelabs.updateJob(session.id_, {
        passed: testName.status() === 'passed',
        name: testName.description
      }, function() {});
    });

    startDate.start();
    await eyes.close(false).then((result) => {
      if (result._isNew) {
        console.log(`New baseline created: URL = ${result._appUrls._session}`);
      } else {
        expect(result._mismatches).toBe(0);
      }
    });
    console.log(`eyes.close done in ${startDate.end().summary}`);

    if (eyes._isOpen) {
      await eyes.close();
    }
    await driver.quit();
    console.log(`afterEach done in ${startDate.end().summary}`);
  });

  testName = it('Hero-3-up element', async function () {
    const startDate = PerformanceUtils.start();

    const _driver = await eyes.open(driver, 'Eyes.SDK.JavaScript', testName.getFullName());
    console.log(`eyes.open done in ${startDate.end().summary}`);

    startDate.start();
    await _driver.get('https://www.indystar.com?tangent');
    console.log(`driver.get done in ${startDate.end().summary}`);

    startDate.start();
    await _driver.findElement(By.css('#ad-slot-7103-in-indianapolis-C1532-high_impact-homepage-1')).then(async function(element) {
      await _driver.wait(until.elementIsVisible(element), 30000);
    });
    await _driver.executeScript("document.querySelector('#ad-slot-7103-in-indianapolis-C1532-high_impact-homepage-1').setAttribute('style', 'display:none')");
    console.log(`High impact AD element was detected and disabled in ${startDate.end().summary}`);

    startDate.start();
    await _driver.wait(until.elementLocated(By.css('#ad-slot-7103-in-indianapolis-C1532-poster_front-homepage-9')), 10000);
    await _driver.executeScript("document.querySelector('#ad-slot-7103-in-indianapolis-C1532-poster_front-homepage-9').setAttribute('style', 'display:none')");
    console.log(`Top poster AD element was detected and disabled in ${startDate.end().summary}`);

    startDate.start();
    await eyes.check(testName.description, Target.region(By.css('.gnt_m_hero')));
    console.log(`eyes.check done in ${startDate.end().summary}`);

    console.log(`total time ${startDateIt.end().summary}`);
    expect(startDateIt.end().time).toBeLessThanOrEqual(10 * 60 * 1000);
  });

});
