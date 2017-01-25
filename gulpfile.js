'use strict';
var gulp = require('gulp');
var webpack = require('gulp-webpack');
var webpackConfig = require('./webpack.config.js');
var browserSync = require('browser-sync');
var notify = require('gulp-notify');
var eslint = require('gulp-eslint');
var excludeGitignore = require('gulp-exclude-gitignore');
var mocha = require('gulp-mocha');
var path = require('path');
var karmaServer = require('karma').Server;
require('babel-core/register');

var PUBLIC_PATH = './public/';
var DIST_FILENAME = 'accordion.js';

var PATHS = {
  htmlDir: PUBLIC_PATH,

  es6: [ 'src/js/**/*.js' ],
  es6Main: path.join('src/js', DIST_FILENAME),
  es6Test: [ 'src/js/test/**/*.js' ],
  js: [path.join(PUBLIC_PATH, '**/*.js')],
  jsDir: PUBLIC_PATH,
  jsAll: ['**/*.js'],
  jsToLint: ['*.js', 'src/**/*.js', './dist/**/*.js'],
  distDir: './dist',

  css: [path.join(PUBLIC_PATH, '**/*.css')],
  cssDir: PUBLIC_PATH
};

var errorHandler = function () {
  var args = Array.prototype.slice.call(arguments);
  notify.onError({
    title: 'Compile Error',
    message: '<%= error %>',
    sound: false
  }).apply(this, args);
  this.emit('end');
};


gulp.task('build', function () {
  var config = Object.assign({}, webpackConfig);
  config.externals = {};
  return gulp.src(PATHS.es6Main)
    .pipe(webpack(config))
    .on('error', errorHandler)
    .pipe(gulp.dest(PATHS.jsDir))
    .pipe(browserSync.stream());
});

gulp.task('dist', function () {
  return gulp.src(PATHS.es6Main)
    .pipe(webpack(webpackConfig))
    .on('error', errorHandler)
    .pipe(gulp.dest(PATHS.distDir))
    .pipe(browserSync.stream());
});

gulp.task('eslint', function () {
  return gulp.src(PATHS.jsToLint)
    .pipe(excludeGitignore())
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('default', function (done) {
  // local server
  browserSync.init({
    open: false,
    server: {
      baseDir: './public',
      middleware: [
        function (req, res, next) {
          /**
           * @param req
           * @param res
           * @param next
           */
          var msg = req.method + ' ' + req.url;
          console.log(msg);
          next();
        }
      ]
    }
  }, done);
  // watch
  gulp.watch(PATHS.es6, ['build', 'dist']);
  gulp.watch(PATHS.jsAll, ['eslint']);
  // test
  new karmaServer({
    configFile: path.join(__dirname, 'karma.conf.js')
  }).start();
});
