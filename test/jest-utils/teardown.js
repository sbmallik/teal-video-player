'use strict';

const orchestrationHelper = requireAbs('test/jest-utils/orchestration-helper.js'),
      config = require('config');

module.exports = async function globalTearDown() {
  if (config.test.video.useSauceConnect === 'true') {
    await orchestrationHelper.stopSauceConnect();
  } else {
    await orchestrationHelper.killChromedriverProcesses();
  }
};
