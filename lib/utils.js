'use strict';

const { SauceLabs } = require('./constants.js');
const username = process.env.SAUCE_USERNAME;
const password = process.env.SAUCE_ACCESS_KEY;
const batchNumber = process.env.APPLITOOLS_BATCH_ID;
const apiKey = process.env.APPLITOOLS_API_KEY;
const seleniumUrl = `http://${username}:${password}@ondemand.saucelabs.com:4444/wd/hub`;
const saucelabs = new SauceLabs({
  username,
  password
});
const capabilities = {
  'browserName': 'chrome',
  'version': '66',
  'platform': 'macOS 10.12',
  'screenResolution': '1600x1200'
};
const BASE_URL = 'https://www.indystar.com?tangent';
const HIGH_IMPACT_AD = '#ad-slot-7103-in-indianapolis-C1532-high_impact-homepage-1';
const TOP_POSTER_AD = '#ad-slot-7103-in-indianapolis-C1532-poster_front-homepage-9';
const POSTER_SCROLL_AD = '#ad-slot-7103-in-indianapolis-C1532-poster_scroll_front-homepage-10';
const TEST_TIMEOUT = 5 * 60 * 1000;
const ELEMENT_TIMEOUT = 30 * 1000;

module.exports = Object.freeze({
  BASE_URL,
  HIGH_IMPACT_AD,
  TOP_POSTER_AD,
  POSTER_SCROLL_AD,
  TEST_TIMEOUT,
  ELEMENT_TIMEOUT,
  username,
  password,
  batchNumber,
  apiKey,
  capabilities,
  seleniumUrl,
  saucelabs
});
