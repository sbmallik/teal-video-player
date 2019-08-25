/*
Note:
Jest sets up a new environment for every test file. Configs are loaded and node vault utility reads secret from file.
*/
const path = require('path');

require('./require-abs.js')(path.resolve(__dirname, '../../') + '/');

global.baseUrl = 'https://dev-uw.usatoday.com';
