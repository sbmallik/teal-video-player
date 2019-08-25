'use strict';

const orchestrationHelper = requireAbs('test/jest-utils/orchestration-helper.js'),
      util = require('util'),
      exec = util.promisify(require('child_process').exec);

module.exports = async function globalTearDown() {
  if (process.env.USE_SAUCE_CONNECT === 'true') {
    await orchestrationHelper.stopSauceConnect();
  } else {
    await orchestrationHelper.killChromedriverProcesses();
  }
};
