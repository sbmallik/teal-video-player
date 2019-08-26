const Transform = require('stream').Transform,
      ejsLint = require('ejs-lint'),
      PluginError = require('plugin-error');

module.exports = () => {
  var transformStream = new Transform({
    objectMode: true
  });
  
  console.log('ejs-lint running...');

  // eslint-disable-next-line
  transformStream._transform = (file, encoding, callback) => {
    const output = file,
          lintObj = ejsLint(file.contents.toString());

    if (lintObj) {
      transformStream.emit('error', new PluginError('gulp-ejs-lint', {
        message: 'ejs-lint found an error in: ' + file.path + '\n' + lintObj.toString(),
        showStack: false
      }));
    }
    
    callback(null, output);
  };

  return transformStream;
};
