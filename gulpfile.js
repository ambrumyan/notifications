'use strict';


var gulp = require('gulp');
var sass = require('gulp-sass');
var cleanCSS = require('gulp-clean-css');
var minify = require('gulp-minify');
var uglify = require('gulp-uglifyjs');


gulp.task('sass', function () {
  return gulp.src(['./app/assets/scss/*.scss', './app/modules/**/*.scss'])
    .pipe(sass().on('error', sass.logError))
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('./css'));
});


gulp.task('js', function () {
  return gulp.src(['./app/modules/**/*.js'])
    .pipe(uglify())
    .pipe(gulp.dest('./js'));
});

gulp.task('html', function () {
  return gulp.src(['./app/modules/notification-messages/*.html'])
    .pipe(gulp.dest('./templates'));
});

var exec = require('child_process').exec;
gulp.task('docs', function(){
	exec('rm -rf ./docs');
	exec(
	  './node_modules/jsdoc/jsdoc.js '+
	    '--configure node_modules/angular-jsdoc/common/conf.json '+   // config file
	    '--template node_modules/angular-jsdoc/angular-template '+   // template file
	    '--destination docs '+                           // output directory
	    './README.md ' +
	    '--recurse ./app/modules/notification-messages/notification-messages.js' 
	); 
});


gulp.task('build', ['sass', 'js', 'html']);
gulp.task('doc', ['docs']);
