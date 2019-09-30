'use strict';

module.exports = {
  api: {
    contentApi: {
      endpoint: 'https://content-api.gannettdigital.com/',
      key: process['vault-client'].contentApiKey
    },
    cdnObliviateApi: {
      endpoint: 'https://cdn-obliviate.gannettdigital.com/obliviate/v1/purge/',
      key: process['vault-client'].cdnObliviateApiKey,
      // defaults are for Fastly Staging service (non production)
      serviceIds: {
        usat: '7Rat8NP47vw8TaDGrs9A9A',
        uscp: '5PUWHhdSLcbCBAyJmi2mg0'
      }
    },
    navigationApi: {
      endpoint: 'https://api.gannett-cdn.com/taxonomy/v4/navigation/schema/id/',
      key: process['vault-client'].navigationKey
    },
  },
  gannettCdn: 'https://www.gannett-cdn.com',
  gannettCdnDomain: 'gannett-cdn.com',
  logger: {
    jsonFormat: true,
    logLevel: 'info'
  },
  test: {
    api: {
      applitools: {
        endpoint: 'https://gannetteyes.applitools.com',
        key: process['vault-client'].applitoolsApiKey
      },
      sauce: {
        user: process.env.SAUCE_USERNAME || process['vault-client'].sauceUsername,
        key: process.env.SAUCE_ACCESS_KEY || process['vault-client'].sauceKey
      },
      webPageTest: {
        endpoint: 'https://web-page-test.gannettdigital.com'
      },
      testAggregatorApi: {
        endpoint: 'http://gannett-production.apigee.net/testaggregatorapi/api/v2/tests',
        key: process['vault-client'].testAggregatorApiKey
      }
    },
    url: 'https://dev-uw.usatoday.com',
    visual: {
      dockerizedChrome: process.env.DOCKERIZED_CHROME || 'true'
    },
  }
};
