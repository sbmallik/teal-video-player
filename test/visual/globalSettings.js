'use strict';

/* Allow absolute paths for reference files based on this folder */
require('../jest-utils/require-abs.js')(__dirname + '/../..');

/* Set default timeout for all tests. */
const TEST_TIMEOUT = 3 * 60 * 1000;
jest.setTimeout(TEST_TIMEOUT);

/* Set the environment for the current test */
global.capabilities = `${process.env.CAPS}`;
global.appName = 'UW';
global.ELEMENT_TIMEOUT = 30000;

const nvaultutil = require('node-vault-utility');
nvaultutil.applyGlobalVariablesFromFile();
