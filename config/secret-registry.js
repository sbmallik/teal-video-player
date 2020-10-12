// contains paths and secret keys needed from Vault, that will get fetched via node-vault-utility library

'use strict';

module.exports = [
  {
    vaultPath: `secret/cet-front-end-development/applications/tangent/${process.env.NODE_ENV}/content-api`,
    secretKey: 'api-key',
    globalVariable: 'contentApiKey'
  },
  {
    vaultPath: 'secret/quality-engineering/applitools/quality-engineering',
    secretKey: 'key',
    globalVariable: 'applitoolsApiKey'
  },
  {
    vaultPath: `secret/cet-front-end-development/applications/tangent/${process.env.NODE_ENV}/cdn-obliviate-api`,
    secretKey: 'key',
    globalVariable: 'cdnObliviateApiKey'
  },
  {
    vaultPath: 'secret/quality-engineering/sauce/qe-test-infrastructure',
    secretKey: 'key',
    globalVariable: 'sauceKey'
  },
  {
    vaultPath: 'secret/quality-engineering/sauce/qe-test-infrastructure',
    secretKey: 'username',
    globalVariable: 'sauceUsername'
  },
  {
    vaultPath: 'secret/cet-front-end-development/qe/test-aggregator-api',
    secretKey: 'key',
    globalVariable: 'testAggregatorApiKey'
  }
];
