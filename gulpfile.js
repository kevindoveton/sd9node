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
  concat = require('gulp-concat');

/*
 * Directories here
 */
var paths = {
  public: './src/static/',
  sass: './src/views/sass/',
  js: './src/static/js/',
  css: './src/static/css/'
};

/**
 * Compile .pug files and pass in data from json file
 * matching file name. index.pug - index.pug.json
 */
gulp.task('pug', function () {
	pump([
		gulp.src('./src/views/*.pug'),
		pug(),
		gulp.dest(paths.public+'html/')
	]);
	return;
});

gulp.task('js', function() {
	// user
	pump([
		gulp.src('./src/views/js/user/*.js'),
		concat('dist.js'),
		uglify({
			mangle: false,
			compress: false,
			output: {
				beautify: true
			}
		}),
		gulp.dest(paths.js)
	], function(e) {
		if (e !== undefined)
		{
			console.log(e);
		}
	});

	// vendor
	pump([
		gulp.src('./src/views/js/vendor/*.js'),
		concat('vendor.js'),
		uglify(),
		gulp.dest(paths.js)
	], function(e) {
		if (e !== undefined)
		{
			console.log(e);
		}
	});
	return;
});

/**
 * Compile .scss files into public css directory With autoprefixer no
 * need for vendor prefixes then live reload the browser.
 */
gulp.task('sass', function () {
	pump([
		gulp.src(paths.sass + '*.sass'),
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
	});
	return;
});

/**
 * Watch scss files for changes & recompile
 * Watch .pug files run pug-rebuild then reload BrowserSync
 */
gulp.task('watch', function () {
  gulp.watch(paths.sass + '**/*.sass', ['sass']);
  gulp.watch('./src/views/*.pug', ['pug']);
  gulp.watch('./src/views/js/**/*.js', ['js', 'js']);
});

// Build task compile sass and pug.
gulp.task('build', ['sass', 'pug', 'js']);

/**
 * Default task, running just `gulp` will compile the sass,
 * compile the jekyll site, launch BrowserSync then watch
 * files for changes
 */
gulp.task('default', ['watch']);
