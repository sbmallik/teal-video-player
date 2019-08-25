'use strict';

const path = require('path');

require('../../jest-utils/require-abs.js')(path.resolve(__dirname, '../../../') + '/');

const generateUtils = requireAbs('/test/jest-utils/generate-utils.js'),
      testsConfigurations = requireAbs('/test/visual/lib/tests-configuration.js'),
      testTemplate = requireAbs('/test/visual/lib/test-template.js'),
      testDirectory = 'test/visual/tests',
      testType = 'visual';

generateUtils.generateTests(testsConfigurations, testTemplate, testDirectory, testType);
