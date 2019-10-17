'use strict';

const path = require('path');
require('./require-abs.js')(path.resolve(__dirname, '../../') + '/');

const orchestrationHelper = requireAbs('test/jest-utils/orchestration-helper.js'),
      capabilities = requireAbs('test/video/lib/constants.js').capabilities;

module.exports = async function globalSetup() {

  let envSettings = process.argv.slice(-1).toString().split('=')[1];
  if (!envSettings) {
    envSettings = 'desktopChrome';
  }

  orchestrationHelper.fetchAndApplySecretsFromVault();
  const config = require('config');
  orchestrationHelper.determineNodeEnvironment();
  orchestrationHelper.setUniqueTestEnvironmentVariables();
  if (config.test.video.useSauceConnect === 'true') {
    await orchestrationHelper.useSauceConnect(config, envSettings);
  }
  capabilities[envSettings].tags = 'teal-player';
  capabilities[envSettings].build = `teal-player-${envSettings}-${process.env.UNIQUE_ID}`;
  capabilities[envSettings].tunnelIdentifier = envSettings;
  process.env.CAPS = JSON.stringify(capabilities[envSettings]);

};
