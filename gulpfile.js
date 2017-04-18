/*global require*/
"use strict";

var gulp = require('gulp'),
  path = require('path'),
  data = require('gulp-data'),
  pug = require('gulp-pug'),
  prefix = require('gulp-autoprefixer'),
  sass = require('gulp-sass'),
  uglify = require('gulp-uglify'),
  pump = require('pump'),
  mainBowerFiles = require('main-bower-files'),
  sourcemaps = require('gulp-sourcemaps'),
  concat = require('gulp-concat');


var paths = new function() {
	this.base_dist = './app/';
	this.css = this.base_dist + 'css/';
	this.js_dist = this.base_dist + 'js/';
	this.html_dist = this.base_dist + 'html/';

	this.base_build = './src/views/';
	this.sass = this.base_build + 'sass/';
	this.js_build = this.base_build + 'js/';
	this.pug = this.base_build + 'pug/';
};

/**
 * Compile .pug files and pass in data from json file
 * matching file name. index.pug - index.pug.json
 */

gulp.task('pug', function (cb) {
	pump([
		gulp.src(paths.pug + '**/*.pug'),
		pug(),
		gulp.dest(paths.html_dist)
	], function(e) {
		if (e !== undefined)
		{
			console.log(e);
		}
        cb();
    });
	return;
});


// JS
gulp.task('js', function(cb) {
	// user
	pump([
		gulp.src(paths.js_build + 'user/**/*.js'),
		uglify({
			mangle: false,
			compress: false,
			output: {
				beautify: true
			}
		}),
		concat('dist.js'),
		gulp.dest(paths.js_dist)
	], function(e) {
		if (e !== undefined)
		{
			console.log(e);
		}
        cb();
	});
});

gulp.task('vendor_js', function(cb) {
	// vendor
	pump([
		gulp.src(paths.js_build + 'vendor/**/*.js'),
		concat('vendor.js'),
		uglify({
			mangle: false,
			compress: false,
			output: {
				beautify: false
			}
		}),
		gulp.dest(paths.js_dist)
	], function(e) {
		if (e !== undefined)
		{
			console.log(e);
		}
        cb();
	});
	return;
})

/**
 * Compile .scss files into public css directory With autoprefixer no
 * need for vendor prefixes then live reload the browser.
*/
gulp.task('sass', function (cb) {
	pump([
		gulp.src(paths.sass + '**/*.sass'),
		sass({
			includePaths: [paths.sass],
			outputStyle: 'compressed'
	  	}),
		prefix(
			[
				'last 15 versions',
				'> 1%',
				'ie 8',
				'ie 7'
			],
			{
				cascade: true
	    	}
		),
		gulp.dest(paths.css)
	], function(e) {
		if (e !== undefined)
		{
			console.log(e);
		}
        cb()
	});
	return;
});

/**
 * Watch scss files for changes & recompile
 * Watch .pug files run pug-rebuild then reload BrowserSync
 */
gulp.task('watch', function () {
	gulp.watch(paths.sass + '**/*.sass', ['sass']);
	gulp.watch(paths.pug + '**/*.pug', ['pug']);
	gulp.watch(paths.js_build + 'user/**/*.js', ['js']);
    gulp.watch(paths.js_build + 'vendor/**/*.js', ['vendor_js']);
});

// Build task compile sass and pug.
gulp.task('build', ['sass', 'pug', 'js', 'vendor_js']);

/**
 * Default task, running just `gulp` will compile the sass,
 * compile the jekyll site, launch BrowserSync then watch
 * files for changes
 */
gulp.task('default', ['build', 'watch']);
