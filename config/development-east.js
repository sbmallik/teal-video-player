'use strict';

module.exports = {
  api: {
    contentApi: {
      endpoint: process.env.CAPI_STAGING === 'true' ? 'https://origin-staging-content-api.gannettdigital.com/' : 'https://content-api.gannettdigital.com/'
    }
  },
  network: {
    connection: {
      log: true
    }
  },
  logger: {
    jsonFormat: false,
    logLevel: 'debug'
  },
  test: {
    url: 'https://tangent-development.indystar.com',
    visual: {
      dockerizedChrome: process.env.DOCKERIZED_CHROME || 'false'
    }
  }
};
