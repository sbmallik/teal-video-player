'use strict';

const dateFormat = require('dateformat'),
      os = require('os'),
      util = require('util'),
      sauce = requireAbs('test/jest-utils/sauce.js'),
      exec = util.promisify(require('child_process').exec);

module.exports = {
  /**
   * Sets the unique id and the setup time environment variables needed for visual tests
   * @returns {undefined} - nothing
   */
  setUniqueTestEnvironmentVariables() {
    process.env.UNIQUE_ID = process.env.BUILD_TAG || `${os.userInfo().username}-${dateFormat(new Date(), 'yyyymd_HHMMss')}`;
    process.env.TEST_SETUP_TIME = new Date().toUTCString();
  },
  /**
   * Starts sauce connect and waits till it is ready to proxy requests
   * @param {string} tunnelId - sauce connect tunnel identifier
   * @returns {undefined} - nothing
   */
  async useSauceConnect(tunnelId) {
    let options;
    options = {
      username: process.env.SAUCE_USERNAME,
      accessKey: process.env.SAUCE_ACCESS_KEY,
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
