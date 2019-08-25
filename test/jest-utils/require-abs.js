'use strict';

/**
 * Creates a global helper function (on init) to allow for requiring tangent modules via common path relative to the $project_root
 * @module
 * @param {string} appRoot - The path of the application root to be used in conjuction to the module's file path.
 */
 
function init(appRoot) {
  // global helper function that gets set
  global.requireAbs = (filePath) => {
    return require(appRoot + filePath);
  };
}

module.exports = (appRoot) => {
  init(appRoot);
};
