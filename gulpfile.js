/*
 *
 *  Include gulp
 *
 **/

var gulp = require('gulp');

/*
 *
 *  Include Necessary Plugins
 *
 **/

var jshint = require('gulp-jshint'),
    sass = require('gulp-sass'),
    connect = require('gulp-connect'),
    rename = require('gulp-rename'),
    cssnano = require('gulp-cssnano'),
    logger = require('gulp-logger'),
    open = require('open'),
    del = require('del');

/*
 * Lazy loader
 *
 * Available to lazy load are:
 *
 * 1. gulp-clean
 * 2. gulp-cat
 *
 */
var $ = require('gulp-load-plugins')();


/*
 * Config object for easy file paths
 *
 **/

var paths = {
  html: 'app/index.html',
  js: 'app/scripts/',
  sass: 'app/assets/scss/',
  css: 'app/css/'
};

/*
 *  Lint Task for our JavaScript
 *
 **/

gulp.task('lint', function() {
  return gulp.src([paths.js + '*.js', paths.js + '**/*.js', paths.js + '**/**.directive.js', paths.js + '**/**.controller.js']) //read all the files that are in 'app/' with an *.js extension
    .pipe(jshint()) // run their contents through jshint
    .pipe(jshint.reporter('default')); // report any findings from jshint
});

/*
 *
 *  Compile Our Sass for our CSS
 *
 **/

gulp.task('sass', function() {
  return gulp.src(paths.sass + '*.scss')
    .pipe(logger({
      before: 'Starting Sass...',
      after: 'Sass complete!',
      dest: 'app/css/',
      extname: '.min.css',
      display: 'name',
      showChange: true
    }))
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(gulp.dest(paths.css))
    .pipe(rename({suffix: '.min'}))
    .pipe(cssnano())
    .pipe(gulp.dest(paths.css))
    .pipe(connect.reload());
});

/*
 *  Watch Files (HTML, CSS, JS) For Changes
 *
 **/

gulp.task('watch', ['connect', 'serve'], function() {
    gulp.watch(paths.js + '*.js', ['lint']);
    gulp.watch(paths.sass + '*.scss', ['sass']);
    gulp.watch(['./app/*.html', 'app/**/*.html'], ['html']);
});

gulp.task('html', function() {
  gulp.src('./app/*.html')
    .pipe(connect.reload());
});


/*
 *  Local Development Server
 *  with LiveReload
 *
 **/


// Local Dev Server
gulp.task('connect', function() {
  connect.server({
    root: ['app'],
    port: 8000,
    livereload: true
  })
});

// Open Default Browser
gulp.task('serve', ['connect'], function() {
  open("http://localhost:8000");
});


/*
 * On initial build clean/remove
 *  css files, start fresh!
 *
 **/

gulp.task('clean', function () {
  return gulp.src([paths.css + '*.min.css', paths.css + '*.css'], { read: false }).pipe($.clean());
});


/*
 *  Simple Beautiful Art
 *
 **/

gulp.task('ascii', function() {
  return gulp.src('./claude-shannon.txt')
    .pipe($.cat());
});

gulp.task('copy', function() {
  return gulp.src('./app/**')
    .pipe(gulp.dest('./build/'));
});

/*
 *  Entry point. Runs all the other tasks.
 *
 *  By default gulp executes 'default' :)
 *
 **/

gulp.task('build', ['ascii','lint', 'sass']);

gulp.task('deploy', ['build', 'copy']);

gulp.task('default', ['clean'], function() {
  gulp.start('build');
  gulp.start('watch');
});