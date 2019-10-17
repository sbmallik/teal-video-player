'use strict';

const dateFormat = require('dateformat'),
      os = require('os'),
      util = require('util'),
      childProcess = require('child_process'),
      nvaultutil = require('node-vault-utility'),
      sauce = requireAbs('test/jest-utils/sauce.js'),
      exec = util.promisify(require('child_process').exec);

module.exports = {
  /**
   * Sets the unique id and the setup time environment variables needed for video tests
   * @returns {undefined} - nothing
   */
  setUniqueTestEnvironmentVariables() {
    process.env.UNIQUE_ID = process.env.BUILD_TAG || `${os.userInfo().username}-${dateFormat(new Date(), 'yyyymd_HHMMss')}`;
    process.env.TEST_SETUP_TIME = new Date().toUTCString();
  },
  /**
   * Sets the node environment to 'development-local' by default if it is unset or 'test'
   * @returns {undefined} - nothing
   */
  determineNodeEnvironment() {
    if (process.env.NODE_ENV !== '' && process.env.NODE_ENV !== 'test' && typeof process.env.NODE_ENV !== 'undefined') {
      console.log(`NODE_ENV already set to '${process.env.NODE_ENV}'`);
    } else {
      process.env.NODE_ENV = 'development-local';
      console.log(`NODE_ENV is not set. It has been set the default of '${process.env.NODE_ENV}'`);
    }
  },
  /**
   * Fetches the secrets from vault via a command. The command line approach is used because it
   * write the file which is then read by the subprocesses that Jest spins up
   * @returns {undefined} - nothing
   */
  fetchAndApplySecretsFromVault() {
    if (typeof process.env.NODE_ENV === 'undefined') {
      throw new Error('NODE_ENV not set. Set NODE_ENV: export NODE_ENV=<my_env>');
    } else {
      const stdout = childProcess.execSync(`npx nvaultutil fetch -e ${process.env.NODE_ENV}`);
      console.log(stdout.toString());
      nvaultutil.applyGlobalVariablesFromFile();
    }
  },
  /**
   * Starts sauce connect and waits till it is ready to proxy requests
   * @param {object} config - configuration data
   * @param {string} tunnelId - sauce connect tunnel identifier
   * @returns {undefined} - nothing
   */
  async useSauceConnect(config, tunnelId) {
    let options;
    options = {
      username: config.test.api.sauce.user,
      accessKey: config.test.api.sauce.key,
      tunnelIdentifier: tunnelId
    };
    await sauce.connect(options);
  },
  /**
   * Stops sauce connect and waits till it has shut down
   * @returns {undefined} - nothing
   */
  async stopSauceConnect() {
    await sauce.stop();
  },
  /**
   * Kills all chromedriver processes. This is needed due to bugs and certain scenarios where chromedriver
   * does not shut down properly even after calling driver.quit
   * @returns {undefined} - nothing
   */
  async killChromedriverProcesses() {
    try {
      console.log('Killing all chromedriver processes.');
      await exec('pkill -f chromedriver');
    } catch (err) {
      console.error(err);
    }
  }
};
