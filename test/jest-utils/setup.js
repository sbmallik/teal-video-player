'use strict';

const path = require('path');
require('./require-abs.js')(path.resolve(__dirname, '../../') + '/');

const orchestrationHelper = requireAbs('test/jest-utils/orchestration-helper.js'),
      capabilities = requireAbs('test/visual/lib/constants.js').capabilities;

module.exports = async function globalSetup() {

  let envSettings = process.argv.slice(-1).toString().split('=')[1];
  if (!envSettings) {
    envSettings = 'androidChrome';
  }

  orchestrationHelper.setUniqueTestEnvironmentVariables();
  capabilities[envSettings].tags = 'uw-visual';
  capabilities[envSettings].build = `uw-${envSettings}-${process.env.UNIQUE_ID}`;
  capabilities[envSettings].tunnelIdentifier = envSettings;
  process.env.CAPS = JSON.stringify(capabilities[envSettings]);
  if (process.env.USE_SAUCE_CONNECT === 'true') {
    await orchestrationHelper.useSauceConnect(envSettings);
  }

};
