'use strict';
/* eslint-disable guard-for-in */
const gulp = require('gulp'),
      brotli = require('gulp-brotli'),
      clean = require('gulp-clean'),
      cleanCss = new (require('clean-css'))(),
      closureCompiler = require('google-closure-compiler').gulp(),
      concat = require('gulp-concat'),
      deleteLines = require('gulp-delete-lines'),
      lintRules = require('./.eslintrc.json'),
      ejsLint = require('./config/build/gulp-ejs-lint'),
      eslint = require('gulp-eslint'),
      flatmap = require('gulp-flatmap'),
      fs = require('fs'),
      hash = require('gulp-hash'),
      htmlhint = require('gulp-htmlhint'),
      jest = require('gulp-jest').default,
      jsBundles = require('./config/build/js-bundles.js'),
      jsonlint = require('gulp-jsonlint'),
      merge = require('merge-stream'),
      htmlMinify = require('html-minifier').minify,
      newer = require('gulp-newer'),
      rename = require('gulp-rename'),
      stringReplace = require('gulp-string-replace'),
      stylelint = require('gulp-stylelint'),
      tap = require('gulp-tap'),
      zopfli = require('gulp-zopfli-green'),
      replaceOpts = {
        logs: {
          enabled: false
        }
      };

const runMode = {
  init: function(mode) {
    this.mode = mode;
    this.inProgress = true;
    this.watchBuildPending = false;
    this.files = [];
  },
  mode: 'build',
  files: [],
  affectedFiles: [],
  affectedFilesBundle: [],
  affectedHash: false,
  inProgress: false,
  watchBuildPending: false,
  watchRunning: false,
  disableTests: false
};

function modeSrc(src, srcDir = 'assets/js/') {
  if (runMode.mode === 'build') {
    return [src];
  } else if (runMode.mode === 'watch') {
    let srcArr = src.map((file) => {
      return srcDir + file;
    });
    for (let file of runMode.files) {
      let bundle = checkForBundle('js/' + file.relative);
      if (!bundle) {
        srcArr = file;
      }
    }
    return srcArr;
  }
}

function checkForBundle(filepath) {
  for (let bundle in jsBundles) {
    for (let file of jsBundles[bundle].files) {
      if (filepath === file) {
        return 'dist/js/' + bundle + '.js';
      }
    }
  }
}

function affectedFilesFn(filepath) {
  let item = 'js/' + filepath.relative;
  for (let bundle in jsBundles) {
    for (let file of jsBundles[bundle].files) {
      if (item === file) {
        runMode.affectedHash = bundle === 'main';
        runMode.affectedFilesBundle.push(bundle + '.js');
        jsBundles[bundle].files.map((i) => {
          runMode.affectedFiles.push(i.replace('js/', ''));
          runMode.affectedFilesBundle.push(i.replace('js/', ''));
        });
      }
    }
  }
}

function stripTemplatingLogic(stream, css) {
  stream = stream
    .pipe(stringReplace(/<%=(.|\s)*?%>/gm, '0', replaceOpts))
    .pipe(stringReplace(/<%-(.|\s)*?%>/gm, '0', replaceOpts));
  if (css) {
    stream = stream
      .pipe(stringReplace(/<%/gm, '/* stylelint-disable */ /*', replaceOpts))
      .pipe(stringReplace(/%>/gm, '*/ /* stylelint-enable */', replaceOpts));
  } else {
    stream = stream.pipe(stringReplace(/<%(.|\s)*?%>/gm, '', replaceOpts));
  }
  return stream
    .pipe(stringReplace(/(<stitch:insert(.|\s)*?>|<\/stitch:insert\s*>)/gm, '', replaceOpts))
    .pipe(stringReplace(/<stitch:location(.|\s)*?\/>/gm, '', replaceOpts));
}

function stripTemplatingLogicLinterJsInline(stream) {
  return stream.pipe(stringReplace(/(?:%>|^).*?(?:<%(?:[^=#-])|$)/gs, (matchingTemplateLines) => {
    let tmp = '';
    for (let line of matchingTemplateLines.split('\n')) {
      if (line !== '') {
        tmp += '/* ' + line.replace(/\*\//g, '') + ' */ // eslint-disable-line';
      }
      tmp += '\n';
    }
    return tmp.slice(0, -1);
  }, replaceOpts));
}

function lintJsEjs(done) {
  if (runMode.disableTests === false) {
    let initialRules = {
          indent: [2, 2, {
            SwitchCase: 1,
            VariableDeclarator: {
              var: 2,
              let: 2,
              const: 3
            },
            FunctionDeclaration: {
              parameters: 'first'
            },
            CallExpression: {
              arguments: 'first'
            },
            ignoredNodes: ['ConditionalExpression'],
            offSetColumn: 1
          }],
          'no-unused-vars': 0
        },
        modifiedRules = Object.assign({}, lintRules.rules, initialRules),
        completeRules = Object.assign({}, lintRules, {
          rules: modifiedRules,
          warnFileIgnored: true
        }),
        task = stripTemplatingLogicLinterJsInline(gulp.src('app/core/views/**/*.{ejs,css}'))
          .pipe(eslint(completeRules)).pipe(eslint.format());

    return task;
  }
  done();
}

gulp.task('lint-js-ejs', lintJsEjs);


function lintConfig(done) {
  if (runMode.disableTests === false) {
    let task = gulp.src(['*.json', '.*.json'])
      .pipe(jsonlint())
      .pipe(jsonlint.reporter());
    if (runMode.mode === 'build' && !runMode.watchRunning) {
      task = task.pipe(eslint.failAfterError());
    }
    return task;
  }
  done();
}

gulp.task('lint-config', lintConfig);

function lintEjsTemplates(done) {
  if (runMode.disableTests === false) {
    return gulp.src(['app/core/views/**/*.{ejs,css}', 'assets/js/*.js', 'dist/js/*.js'])
      .pipe(ejsLint());
  }
  done();
}

gulp.task('lint-ejs-templates', lintEjsTemplates);

function lintCssTemplates(done) {
  if (runMode.disableTests === false) {
    return stripTemplatingLogic(gulp.src(['app/core/views/**/*.css', 'app/external/**/*.css']), true)
      .pipe(stylelint({
        reporters: [{
          formatter: 'verbose',
          console: true
        }]
      }));
  }
  done();
}

gulp.task('lint-css-templates', lintCssTemplates);

function lintHtmlTemplates(done) {
  if (runMode.disableTests === false) {
    return stripTemplatingLogic(gulp.src('app/core/views/**/*.ejs'), false)
      .pipe(htmlhint('.htmlhintrc.json', [
        require('./lintrules/external-script-async.js'),
        require('./lintrules/target-blank-require-noopener.js'),
        require('./lintrules/external-stylesheets-disabled.js'),
        require('./lintrules/attr-disabled.js'),
        require('./lintrules/element-disabled.js')
      ]))
      .pipe(htmlhint.reporter());
  }
  done();
}

gulp.task('lint-html-templates', lintHtmlTemplates);

function cleanScriptsDirectory(done) {

  if (runMode.mode === 'build') {
    return gulp.src(['dist/js/**/*', 'dist/assets.json'], {
      allowEmpty: true,
      read: false
    }).pipe(clean());
  } else if (runMode.affectedHash) {
    const deleteAsset = gulp.src('dist/assets.json', {
            allowEmpty: true
          }).pipe(clean()),
          deleteHashFiles = gulp.src('dist/js/**/main*', {
            allowEmpty: true
          }).pipe(clean());
    return merge(deleteAsset, deleteHashFiles);
  }
  done();
}

gulp.task('clean-scripts-directory', cleanScriptsDirectory);

function cleanTemp() {
  return gulp.src('dist/temp', {
    allowEmpty: true,
    read: false
  }).pipe(clean());
}

gulp.task('clean-temp', cleanTemp);

function lintScripts(done) {
  if (runMode.disableTests === false) {
    let task = gulp.src(['assets/js/**/*.js', 'lintrules/**/*.js', 'gulpfile.js', 'externs.js', 'app/**/*.js', 'test/**/*.js'])
      .pipe(deleteLines({
        filters: [/debug only/],
        leaveEmpty: true
      }))
      .pipe(eslint({
        warnFileIgnored: true
      }))
      .pipe(eslint.format());
    if (runMode.mode === 'build' && !runMode.watchRunning) {
      task = task.pipe(eslint.failAfterError());
    }
    return task;
  }
  done();
}

gulp.task('lint-scripts', lintScripts);

function testScripts(done) {
  if (runMode.disableTests === false) {
    process.env.NODE_ENV = 'test';
    return gulp.src('.')
      .pipe(jest({
        config: './test/unit/jestUnitConfig.json'
      }));
  }
  done();
}

gulp.task('test-scripts', testScripts);

function cleanAndDistScripts() {
  let buildModeSrc;
  if (runMode.mode === 'build') {
    buildModeSrc = modeSrc('assets/js/**/*', 'assets/js/');
  } else {
    buildModeSrc = modeSrc(runMode.affectedFiles);
  }

  const srcOpts = runMode.mode === 'build' ? {} : {
    base: 'assets/js',
    allowEmpty: true
  },
        debugFileStep = gulp.src(buildModeSrc, srcOpts)
          .pipe(deleteLines({
            filters: [/unit testing/],
            leaveEmpty: true
          }))
          .pipe(rename((path) => {
            if (path.extname) {
              path.basename += '-debug';
            }
          }))
          .pipe(stringReplace(/(?:'|")gnt-include-nostr ([^)].*) gnt-include-nostr(?:'|")/g, function gntIncludeNoStr(line, captured) {
            return fs.readFileSync(__dirname + '/' + captured, 'utf-8');
          }, replaceOpts))
          .pipe(stringReplace(/gnt-include ([^)].*) gnt-include/g, function gntInclude(line, captured) {
            return fs.readFileSync(__dirname + '/' + captured, 'utf-8');
          }, replaceOpts))
          .pipe(gulp.dest('dist/temp/js')),
        distStep = gulp.src(buildModeSrc, srcOpts)
          .pipe(deleteLines({
            filters: [/unit testing|debug only|no-console/],
            leaveEmpty: true
          }))
          .pipe(stringReplace(/(?:'|")gnt-include-nostr ([^)].*) gnt-include-nostr(?:'|")/g, function gntIncludeNoStr(line, captured) {
            return fs.readFileSync(__dirname + '/' + captured, 'utf-8');
          }, replaceOpts))
          .pipe(stringReplace(/gnt-include ([^)].*) gnt-include/g, function gntInclude(line, captured) {
            const fileContents = fs.readFileSync(__dirname + '/' + captured, 'utf-8');
            return captured.indexOf('.css') === -1 ? fileContents : cleanCss.minify(fileContents).styles;
          }, replaceOpts))
          .pipe(gulp.dest('dist/js'));
  
  return merge(debugFileStep, distStep);
}

gulp.task('clean-and-dist-scripts', gulp.series('clean-scripts-directory', 'clean-temp', 'lint-scripts', 'test-scripts', cleanAndDistScripts));

function buildBundles() {
  const newPathBundles = {},
        newPathBundlesDebug = {},
        bundleStreams = [];

  for (const name in jsBundles) {
    newPathBundles[name] = [];
    newPathBundlesDebug[name] = [];
    for (const path of jsBundles[name].files) {
      newPathBundles[name].push('dist/' + path);
      newPathBundlesDebug[name].push('dist/temp/' + path.replace('.js', '-debug.js'));
    }
  }

  for (const name in newPathBundles) {
    bundleStreams.push(gulp.src(newPathBundles[name], {
      allowEmpty: true
    })
      .pipe(concat(name + '.js'))
      .pipe(gulp.dest('dist/js')));

    bundleStreams.push(gulp.src(newPathBundlesDebug[name], {
      allowEmpty: true
    })
      .pipe(concat(name + '-debug.js'))
      .pipe(gulp.dest('dist/temp/js')));
  }
  return merge(...bundleStreams);
}

gulp.task('build-bundles', gulp.series('clean-and-dist-scripts', buildBundles));

function minify(done) {

  let buildModeSrc;
  if (runMode.mode === 'build') {
    buildModeSrc = modeSrc('dist/js/**/*.js');
  } else {
    buildModeSrc = modeSrc(runMode.affectedFilesBundle, 'dist/js/');
  }

  return gulp.src(buildModeSrc, {
    allowEmpty: true
  })
    .pipe(flatmap((stream, file) => {
      const bundle = jsBundles[file.relative.slice(0, -3)];

      return closureCompiler({
        js: file.path,
        externs: ['externs.js'],
        jscomp_off: ['uselessCode'], // eslint-disable-line camelcase
        language_in: 'ECMASCRIPT_NEXT', // eslint-disable-line camelcase
        language_out: 'ECMASCRIPT_2017', // eslint-disable-line camelcase
        js_output_file: file.relative.replace('.js', '.min.js') // eslint-disable-line camelcase
      }, {
        platform: ['native']
      }).src().pipe(stringReplace(bundle && bundle.external ? /"use strict";/gm : /'use strict';/gm, '', replaceOpts));
    })).on('error', (err) => {
      console.error('closure compiler error: ', err); // eslint-disable-line no-console
      if (runMode.mode === 'build') {
        throw err;
      }
      done();
    })
    .pipe(gulp.dest('dist/js'));
}

gulp.task('minify', minify);

function postMinify() {
  return merge(gulp.src('dist/js/**/*.js', {
    base: './',
    allowEmpty: true
  }), gulp.src('dist/temp/js/**/*', {
    base: './',
    allowEmpty: true
  })).pipe(flatmap((stream) => {
    return stream
      .pipe(stringReplace(/(?:'|")repstr|repstr(?:'|")/gm, '', replaceOpts))
      .pipe(stringReplace(/(?:conditionstart|conditionend).*?:*?('|")(.*?)\1(,|\s*?})/gm, (matchedString, group1, group2, group3) => {
        return group2 + (group3 === ',' ? '' : group3);
      }, replaceOpts))
      .pipe(gulp.dest('./'));
  }));
}

gulp.task('post-minify', postMinify);

function hashAssets(done) {

  let buildModeSrc;
  if (runMode.mode === 'build' || runMode.affectedHash) {
    buildModeSrc = ['dist/js/*.min.js', 'dist/html/*.min.html'];
  } else {
    return done();
  }

  const mainHashStep = gulp.src(buildModeSrc, {
          allowEmpty: true
        })
          .pipe(flatmap((stream, file) => {
            const bundle = jsBundles[file.relative.substr(0, file.relative.indexOf('.'))];
            if (bundle && bundle.external || file.relative.endsWith('html')) {
              return stream
                .pipe(hash({
                  template: '<%= name.indexOf(".min") > -1 ? name.replace(".min", "-q1a2z3" + hash + ".min") : name + "-q1a2z3" %><%= name.indexOf(".min") < 0 ? hash : "" %><%= ext %>'
                }))
                .pipe(gulp.dest(file.dirname))
                .pipe(hash.manifest('dist/assets.json', {
                  append: true
                }))
                .pipe(gulp.dest('.'));
            }
            return stream;
          })),
        debugHashStep = gulp.src(['dist/temp/js/**/*', 'dist/html/*-debug.html'])
          .pipe(flatmap((stream, file) => {
            const bundle = jsBundles[file.relative.substr(0, file.relative.indexOf('-debug'))];
            if (bundle && bundle.external || file.relative.endsWith('html')) {
              return stream
                .pipe(hash({
                  template: '<%= name %>-q1a2z3<%= hash %><%= ext %>'
                }))
                .pipe(gulp.dest(file.dirname.replace('/temp', '')))
                .pipe(hash.manifest('dist/assets.json', {
                  append: true
                }))
                .pipe(gulp.dest('.'));
            }
            return stream;
          }));

  return merge(mainHashStep, debugHashStep);
}

gulp.task('hash-assets', hashAssets);

function zopfliCompressScripts(done) {

  let buildModeSrc;
  if (runMode.mode === 'build' || runMode.affectedHash) {
    buildModeSrc = 'dist/js/**/*.min.js';
  } else {
    return done();
  }

  const mainZopfliStep = gulp.src(buildModeSrc, {
          allowEmpty: true
        })
          .pipe(flatmap((stream, file) => {
            const bundle = jsBundles[file.relative.substr(0, file.relative.indexOf('-q1a2z3'))];
            if (bundle && bundle.external) {
              return stream
                .pipe(zopfli({
                  format: 'gzip',
                  numiterations: 100
                }))
                .pipe(gulp.dest('dist/js'));
            }
            return stream;
          })),
        debugZopfliStep = gulp.src('dist/js/**/*-debug-*')
          .pipe(flatmap((stream, file) => {
            const bundle = jsBundles[file.relative.substr(0, file.relative.indexOf('-debug'))];
            if (bundle && bundle.external) {
              return stream
                .pipe(zopfli({
                  format: 'gzip',
                  numiterations: 100
                }))
                .pipe(gulp.dest('dist/js'));
            }
            return stream;
          }));

  return merge(mainZopfliStep, debugZopfliStep);
}

gulp.task('zopfli-compress-scripts', zopfliCompressScripts);

function brotliCompressScripts(done) {

  let buildModeSrc;
  if (runMode.mode === 'build' || runMode.affectedHash) {
    buildModeSrc = 'dist/js/**/*.min.js';
  } else {
    return done();
  }

  const mainBrotliStep = gulp.src(buildModeSrc, {
          allowEmpty: true
        })
          .pipe(flatmap((stream, file) => {
            const bundle = jsBundles[file.relative.substr(0, file.relative.indexOf('-q1a2z3'))];
            if (bundle && bundle.external) {
              return stream
                .pipe(brotli.compress({
                  mode: 0,
                  quality: 11,
                  lgblock: 0
                }))
                .pipe(gulp.dest('dist/js'));
            }
            return stream;
          })),
        debugBrotliStep = gulp.src('dist/js/**/*-debug-*')
          .pipe(flatmap((stream, file) => {
            const bundle = jsBundles[file.relative.substr(0, file.relative.indexOf('-debug'))];
            if (bundle && bundle.external) {
              return stream
                .pipe(brotli.compress({
                  mode: 0,
                  quality: 11,
                  lgblock: 0
                }))
                .pipe(gulp.dest('dist/js'));
            }
            return stream;
          }));

  return merge(mainBrotliStep, debugBrotliStep);
}

gulp.task('brotli-compress-scripts', brotliCompressScripts);

function cleanSvgDirectory(done) {
  if (runMode.mode === 'build') {
    return gulp.src('dist/svg', {
      allowEmpty: true,
      read: false
    }).pipe(clean());
  }
  done();
}

gulp.task('clean-svg-directory', cleanSvgDirectory);

function cleanAndDistSvg(done) {
  if (runMode.mode === 'build') {
    return gulp.src('assets/svg/**')
      .pipe(gulp.dest('dist/svg'));
  }
  done();
}

gulp.task('clean-and-dist-svg', gulp.series('clean-svg-directory', cleanAndDistSvg));

function cleanHtmlDirectory(done) {
  if (runMode.mode === 'build') {
    return gulp.src('dist/html', {
      allowEmpty: true,
      read: false
    }).pipe(clean());
  }
  done();
}

gulp.task('clean-html-directory', cleanHtmlDirectory);

function cleanAndDistHtml(done) {
  if (runMode.mode === 'build') {
    return gulp.src('assets/html/*.html')
      .pipe(gulp.dest('dist/html'))
      .pipe(rename((path) => {
        if (path.extname) {
          path.basename += '-debug';
        }
      }))
      .pipe(gulp.dest('dist/html'));
  }
  done();
}

gulp.task('clean-and-dist-html', gulp.series('clean-html-directory', cleanAndDistHtml));

function minifyHtml() {

  const options = {
    collapseBooleanAttributes: true,
    collapseInlineTagWhitespace: true,
    collapseWhitespace: true,
    customEventAttributes: [],
    decodeEntities: true,
    ignoreCustomComments: [/^gnt-include/],
    ignoreCustomFragments: [],
    keepClosingSlash: true,
    minifyCSS: true,
    quoteCharacter: '"',
    removeAttributeQuotes: true,
    removeComments: true,
    removeRedundantAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    sortAttributes: true,
    useShortDoctype: true
  };

  return gulp.src('dist/html/*.html', {
    allowEmpty: true
  })
    .pipe(flatmap((stream, file) => {
      if (file.relative.indexOf('-debug') < 0) {
        file.contents = Buffer.from(htmlMinify(file.contents.toString(), options));

        return stream.pipe(rename((path) => {
          if (path.extname) {
            path.basename += '.min';
          }
        }));
      }
      return stream;
    }))
    .pipe(gulp.dest('dist/html'));
}

gulp.task('minify-html', minifyHtml);

function postMinifyHtml() {

  let debugMode = true;

  function replaceJsFileContents(matched, scriptName) {
    return fs.readFileSync(__dirname + '/' + (debugMode ? 'dist/temp/js/' : 'dist/js/') + scriptName + (debugMode ? '-debug.js' : '.min.js'), 'utf-8').trim();
  }

  return gulp.src('dist/html/*.html', {
    allowEmpty: true
  })
    .pipe(flatmap((stream, file) => {
      debugMode = file.relative.indexOf('.min') < 0;
      file.contents = Buffer.from(file.contents.toString()
        .replace(/['"`]?gnt-include-js ([^)].*) gnt-include-js['"`]?/g, replaceJsFileContents));
      return stream;
    }))
    .pipe(gulp.dest('dist/html'));
}

gulp.task('post-minify-html', postMinifyHtml);

function brotliCompressHtml() {
  return gulp.src('dist/html/*-q1a2z3*.html')
    .pipe(brotli.compress({
      mode: 0,
      quality: 11,
      lgblock: 0
    }))
    .pipe(gulp.dest('dist/html'));
}

gulp.task('brotli-compress-html', brotliCompressHtml);

function zopfliCompressHtml() {
  return gulp.src('dist/html/*-q1a2z3*.html')
    .pipe(zopfli({
      format: 'gzip',
      numiterations: 100
    }))
    .pipe(gulp.dest('dist/html'));
}

gulp.task('zopfli-compress-html', zopfliCompressHtml);

gulp.task('compress-html', gulp.parallel('brotli-compress-html', 'zopfli-compress-html'));

gulp.task('build-html', gulp.series('clean-and-dist-svg', 'hash-assets', 'compress-html'));

function cleanSitespecificDirectory(done) {
  if (runMode.mode === 'build') {
    return gulp.src(['dist/sites'], {
      allowEmpty: true,
      read: false
    }).pipe(clean());
  }
  done();
}

gulp.task('clean-sitespecific-directory', cleanSitespecificDirectory);

function cleanAndDistSitespecific(done) {
  if (runMode.mode === 'build') {
    return gulp.src('assets/sites/**')
      .pipe(gulp.dest('dist/sites'));
  }
  done();
}

gulp.task('clean-and-dist-sitespecific', gulp.series('clean-sitespecific-directory', cleanAndDistSitespecific));

function brotliCompressSitespecific() {
  return gulp.src('dist/sites/**/*.ico')
    .pipe(brotli.compress({
      mode: 0,
      quality: 11,
      lgblock: 0
    }))
    .pipe(gulp.dest('dist/sites'));
}

gulp.task('brotli-compress-sitespecific', brotliCompressSitespecific);

function zopfliCompressSitespecific() {
  return gulp.src('dist/sites/**/*.ico')
    .pipe(zopfli({
      format: 'gzip',
      numiterations: 100
    }))
    .pipe(gulp.dest('dist/sites'));
}

gulp.task('zopfli-compress-sitespecific', zopfliCompressSitespecific);

gulp.task('compress-assets', gulp.parallel(gulp.series(gulp.parallel(gulp.series('build-bundles', 'minify', 'post-minify'), gulp.series('clean-and-dist-html', 'minify-html')), 'post-minify-html', 'hash-assets', gulp.parallel('brotli-compress-scripts', 'zopfli-compress-scripts', 'compress-html')), gulp.series('clean-and-dist-sitespecific', gulp.parallel('brotli-compress-sitespecific', 'zopfli-compress-sitespecific'))));

function moveDebug() {
  return gulp.src('dist/temp/js/**/*debug*.js*')
    .pipe(gulp.dest('dist/js'));
}

gulp.task('move-debug', gulp.series('lint-config', 'clean-and-dist-svg', 'lint-html-templates', 'lint-css-templates', 'lint-ejs-templates', 'lint-js-ejs', 'compress-assets', moveDebug));

function buildAllStart() {
  return gulp.src('dist/temp', {
    allowEmpty: true,
    read: false
  })
    .pipe(clean());
}

gulp.task('build-all-start', gulp.series('move-debug', buildAllStart));

function buildAll(done) {
  runMode.inProgress = false;
  runMode.watchBuildPending = false;
  done();
}

gulp.task('build-all', gulp.series('build-all-start', buildAll));

function buildAllNoTests(done) {
  runMode.disableTests = true;
  done();
}

gulp.task('build-all-no-tests', gulp.series(buildAllNoTests, 'build-all'));

gulp.task('cheeseburger', gulp.series('build-all'));

function getNewer() {
  runMode.files = [];
  runMode.affectedFiles = [];
  runMode.affectedFilesBundle = [];
  return gulp.src('assets/js/**/*')
    .pipe(newer('dist/js'))
    .pipe(tap((file) => {
      affectedFilesFn(file);
      runMode.files.push(file);
    }));
}

gulp.task('get-newer', getNewer);

function startWatcher(done) {
  console.log('******* START WATCH BUILD *******'); // eslint-disable-line no-console
  runMode.watchBuildPending = true;
  runMode.inProgress = true;
  done();
}

gulp.task('hash-tasks', gulp.series(hashAssets, gulp.parallel(brotliCompressScripts, zopfliCompressScripts)));

gulp.task('js', gulp.series(cleanScriptsDirectory, cleanTemp, lintScripts, cleanAndDistScripts, buildBundles, minify, postMinify, 'hash-tasks', moveDebug, buildAllStart));

gulp.task('js-watch', gulp.series(startWatcher, 'get-newer', 'js'));

function watchFiles() {
  runMode.watchRunning = true;
  runMode.init('watch');
  gulp.watch(['assets/js/**/*', 'config/build/js-bundles.js'], {
    ignoreInitial: true
  }, gulp.series('js-watch'));
}

gulp.task('dev-watch', gulp.series('build-all', watchFiles));

gulp.task('lint-all', gulp.series('lint-scripts', 'lint-config', 'lint-html-templates', 'lint-css-templates', 'lint-ejs-templates', 'lint-js-ejs'));
