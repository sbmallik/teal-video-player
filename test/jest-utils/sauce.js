'use strict';

const request = require('request'),
      sauceConnectLauncher = require('sauce-connect-launcher');

let saucelabs;

module.exports = saucelabs = {

  /**
   * Set sauce test status
   * @param {string} jobId - session for the sauce test
   * @param {boolean} success - status for the test
   * @param {object} authorization - object containing the user and pass for sauce
   * @returns {Promise<object>} - returns a promise object
  */
  setSauceStatus(jobId, success, authorization) {
    return new Promise((resolve, reject) => {
      
      let options = {
        url: `https://saucelabs.com/rest/v1/${authorization.user}/jobs/${jobId}`,
        method: 'PUT',
        body: `{"passed": ${success}}`,
        auth: {
          user: authorization.user,
          pass: authorization.pass
        }
      };

      request(options, (error, response) => {
        if (error || response.statusCode < 200 || response.statusCode >= 300) {
          console.error(`failed to report job: ${jobId}, status: ${success}, error: ${error}`);
          reject(error);
        }
        resolve();
      });
      
    });
  },

  /**
   * start a sauce tunnel
   * @param {Object} options - Object containing options to sauce
   * @returns {Promise<object>} - returns a promise object
  */
  connect(options) {
    return new Promise((resolve, reject) => {
      console.log('Creating sauce connect tunnel...');
      sauceConnectLauncher(options, (error, sauceConnectProcess) => {
        if (error) {
          reject(error);
        } else {
          console.log('Sauce Connect process connected');
          saucelabs.sauceConnectProcess = sauceConnectProcess;
          resolve();
        }
      });
    });
  },
  stop() {
    return new Promise((resolve) => {
      saucelabs.sauceConnectProcess.close(() => {
        console.log('Closed Sauce Connect process');
        resolve();
      });
    });
  }
};
