'use strict';

const orchestrationHelper = requireAbs('test/jest-utils/orchestration-helper.js');

module.exports = async function globalTearDown() {
  if (process.env.USE_SAUCE_CONNECT === 'true') {
    await orchestrationHelper.stopSauceConnect();
  } else {
    await orchestrationHelper.killChromedriverProcesses();
  }
};
