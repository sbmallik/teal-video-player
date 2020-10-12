/*
Note:
Jest sets up a new environment for every test file. Configs are loaded and node vault utility reads secret from file.
*/

/* Allow absolute paths for reference files based on this folder */
require('./jest-utils/require-abs.js')(__dirname + '/..');

const nvaultutil = require('node-vault-utility');
nvaultutil.applyGlobalVariablesFromFile();
const config = require('config');

global.baseUrl = config.get('test.url');

/* Set default timeout for all tests. */
const TEST_TIMEOUT = 3 * 60 * 1000;
jest.setTimeout(TEST_TIMEOUT);

/* Set the environment for the current test */
global.capabilities = `${process.env.CAPS}`;
global.appName = 'tealPlayer';
global.ELEMENT_TIMEOUT = 5000;
