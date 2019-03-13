'use strict';

const {
  Builder, ConsoleLogHandler, Eyes, FixedCutProvider, MatchLevel, CorsIframeHandle,
  batchNumber, apiKey, capabilities, seleniumUrl, saucelabs
} = require('./constants.js');

module.exports = {
  eyesInit: function() {
    let eyes = new Eyes();
    eyes.setLogHandler(new ConsoleLogHandler(false));
    eyes.setApiKey(apiKey);
    eyes.setSendDom(false);
    eyes.setHideScrollbars(true);
    eyes.setMatchLevel(MatchLevel.Layout2);
    eyes.setForceFullPageScreenshot(false);
    eyes.setBatch('tangent-visual-tests-' + batchNumber, batchNumber || Date.now());
    return eyes;
  },
  eyesVisualGridInit: function() {
    let eyes = new Eyes(undefined, undefined, true);
    eyes.setLogHandler(new ConsoleLogHandler(false));
    eyes.setSendDom(false);
    eyes.setApiKey(apiKey);
    eyes.setBatch('tangent-visual-tests-' + batchNumber, batchNumber || Date.now());
    eyes.setMatchLevel(MatchLevel.Strict);
    eyes.setCorsIframeHandle(CorsIframeHandle.BLANK);
    return eyes;
  },
  driverInit: function(testName) {
    let driver = new Builder().withCapabilities(capabilities).usingServer(seleniumUrl).build();
    driver.getSession().then(function(sessionid) {
      driver.sessionID = sessionid.id_;
      console.log(`SauceOnDemandSessionID = ${driver.sessionID}, Test name = ${testName}`);
    });
    return driver;
  },
  updateSauce: function(driver, testName, testStatus) {
    driver.getSession().then(function(session) {
      console.log(`SauceOnDemandSessionID= + ${session.id_}, Test name = ${testName}, Test status = ${testStatus}`);
      saucelabs.updateJob(session.id_, {
        passed: testStatus === 'passed',
        name: testName
      }, function() {});
    });
  },
  validateResult: function(eyes) {
    eyes.close(false).then((result) => {
      if (result._isNew) {
        console.log(`New baseline created: URL = ${result._appUrls._session}`);
      } else {
        expect(result._mismatches).toBe(0);
      }
    }).then(async function() {
      if (eyes._isOpen) {
        await eyes.close();
      }
    });
  }
};
