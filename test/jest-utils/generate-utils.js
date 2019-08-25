'use strict';

const path = require('path'),
      fs = require('fs'),
      Linter = require('eslint').Linter,
      eslint = new Linter(),
      eslintConfig = requireAbs('.eslintrc.json');

/**
 * Generate Utilities
 * @module
 */
module.exports = {
  /**
   * Generates a set of visual tests
   * @param {object} testsConfigurations - test configuration
   * @param {string} testTemplate - test template
   * @param {string} testDirectory - path to testDirectory
   * @param {string} testType - type of test
   * @returns {Array} the test configurations used to generate the written tests
   */
  generateTests(testsConfigurations, testTemplate, testDirectory, testType) {
    module.exports.cleanTestDirectory(testDirectory, testType);
    const onlyExists = module.exports.checkForDuplicatesAndOnly(testsConfigurations),
          tags = module.exports.getTags('tags'),
          ignoreTags = module.exports.getTags('ignoreTags'),
          name = module.exports.getName();
  
    // Communicate to user what test filtering is doing
    if (onlyExists) {
      console.log('Using \'only\' to filter tests');
    } else if (name) {
      console.log(`Using 'name' to filter tests. Passed in name: '${name}'`);
    } else if (tags) {
      console.log(`Using 'tags' to filter tests. Passed in tags: '${tags}'`);
    } else if (ignoreTags) {
      console.log(`Using 'ignoreTags to filter tests. Passed in ignoreTags '${ignoreTags}'`);
    } else {
      console.log('Generating and writing all tests');
    }
    
    const testConfigurationsUsed = [];

    // Write all tests
    for (const testConfiguration of testsConfigurations) {
      if (onlyExists) {
        if (testConfiguration.only) {
          module.exports.generateAndWriteTest(testConfiguration, testTemplate, testDirectory, testType);
          testConfigurationsUsed.push(testConfiguration);
        }
      } else if (name) {
        if (testConfiguration.name === name) {
          module.exports.generateAndWriteTest(testConfiguration, testTemplate, testDirectory, testType);
          testConfigurationsUsed.push(testConfiguration);
        }
      } else if (tags) {
        for (const tag of tags) {
          if (Array.isArray(testConfiguration.tags) && testConfiguration.tags.indexOf(tag) > -1) {
            module.exports.generateAndWriteTest(testConfiguration, testTemplate, testDirectory, testType);
            testConfigurationsUsed.push(testConfiguration);
          }
        }
      } else if (ignoreTags) {
        if (Array.isArray(testConfiguration.tags) && !testConfiguration.tags.some((x) => {
          return ignoreTags.indexOf(x) !== -1;
        })) {
          module.exports.generateAndWriteTest(testConfiguration, testTemplate, testDirectory, testType);
          testConfigurationsUsed.push(testConfiguration);
        }
      } else {
        module.exports.generateAndWriteTest(testConfiguration, testTemplate, testDirectory, testType);
        testConfigurationsUsed.push(testConfiguration);
      }
    }

    return testConfigurationsUsed;
  },
  /**
   * Deletes all test files ending in the test directory
   * @param {string} testDirectory - path to test directory
   * @param {string} testType - type of test
   * @returns {undefined}
   */
  cleanTestDirectory(testDirectory, testType) {
    // Delete all javascript files in folder if flag is passed in
    let cleanTestDirectory = process.argv.indexOf('--cleanTestDirectory') !== -1;
    if (cleanTestDirectory) {
      const testsDirectoryPath = path.resolve(testDirectory),
            items = fs.readdirSync(testsDirectoryPath);

      for (const item of items) {
        if (item.indexOf(`${testType}.test.js`) > -1) {
          fs.unlinkSync(path.resolve(testsDirectoryPath, item));
        }
      }
    }
  },
  /**
   * Get the tags passed in on the command line
   * @param {string} name - name of the command line argument tag
   * @returns {(undefined|Array)} undefined is there are no tags or an array of tags passed in on the command line
   */
  getTags(name) {
    // Get tags if they exist
    let tags;
    const tagsIndex = process.argv.indexOf(`--${name}`);
    if (tagsIndex > -1) {
      let tagsString = process.argv[tagsIndex + 1];
      tags = tagsString.split(',');
    }
    return tags;
  },
  /**
   * Get the name passed in on the command line
   * @returns {(undefined|string)} undefined is there was no name or that was passed in on the command line
   */
  getName() {
    // Get name if it exists
    let name;
    const nameIndex = process.argv.indexOf('--name');
    if (nameIndex > -1) {
      name = process.argv[nameIndex + 1];
    }
    return name;
  },
  /**
   * Checks if there are any duplicate names in the test configuration array.
   * Also, check is there are any test configurations that have the 'only' property set to true
   * @param {object} testsConfigurations - object containing the test configuration
   * @returns {boolean} Whether or not there was a test configuration with an 'only' property that was truthy
   */
  checkForDuplicatesAndOnly(testsConfigurations) {
    const names = [];
    let onlyExists = false;

    for (const testConfiguration of testsConfigurations) {
      // Check to ensure all tests names are unique
      if (names.indexOf(testConfiguration.name) > -1) {
        throw new Error(`Duplicate test name detected: '${testConfiguration.name}'`);
      }
      names.push(testConfiguration.name);
      
      // Check if 'only' is true to use as filtering later on
      if (!onlyExists && testConfiguration.only) {
        onlyExists = true;
      }
    }

    return onlyExists;
  },
  /**
   * Uses a test template to generate javascript, lints it with eslint, and then writes it to the test directory
   * @param {Object} testConfiguration - An object from the test configurations array
   * @param {string} testTemplate -  template to be used to generate test
   * @param {string} testDirectory - path to the test directory
   * @param {string} testType - type of test
   * @returns {undefined} nothing
   */
  generateAndWriteTest(testConfiguration, testTemplate, testDirectory, testType) {
    const eslintResult = eslint.verifyAndFix(testTemplate(testConfiguration), eslintConfig);
    fs.writeFileSync(path.resolve(testDirectory, `${testConfiguration.name}.${testType}.test.js`), eslintResult.output);
  }
};
