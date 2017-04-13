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

/*
 * Directories here
 */
// var client_paths = {
// 	base_dist: './src/client_static/',
// 	css: this.base_dist + 'css/',
// 	js_dist: this.base_dist + 'js/',
// 	html_dist: this.base_dist + 'html/',
//
// 	base_build: './src/client_views/',
// 	sass: this.base_build + 'sass/',
// 	js_build: this.base_build + 'js/',
// 	pug: this.base_build + 'pug/'
// };

var client_paths = new function() {
	this.base_dist = './src/client_static/';
	this.css = this.base_dist + 'css/';
	this.js_dist = this.base_dist + 'js/';
	this.html_dist = this.base_dist + 'html/';

	this.base_build = './src/client_views/';
	this.sass = this.base_build + 'sass/';
	this.js_build = this.base_build + 'js/';
	this.pug = this.base_build + 'pug/';
};

var server_paths = new function() {
	this.base_dist = './src/server_static/';
	this.css = this.base_dist + 'css/';
	this.js_dist = this.base_dist + 'js/';
	this.html_dist = this.base_dist + 'html/';

	this.base_build = './src/server_views/';
	this.sass = this.base_build + 'sass/';
	this.js_build = this.base_build + 'js/';
	this.pug = this.base_build + 'pug/';
};

/**
 * Compile .pug files and pass in data from json file
 * matching file name. index.pug - index.pug.json
 */
gulp.task('client_pug', function () {
	pump([
		gulp.src(client_paths.pug + '*.pug'),
		pug(),
		gulp.dest(client_paths.html_dist)
	]);
	return;
});

gulp.task('server_pug', function () {
	pump([
		gulp.src(server_paths.pug + '*.pug'),
		pug(),
		gulp.dest(server_paths.html_dist)
	]);
	return;
});


// JS
gulp.task('client_js', function(cb) {
	// user
	pump([
		gulp.src(client_paths.js_build + 'user/*.js'),
		concat('dist.js'),
		uglify({
			mangle: false,
			compress: false,
			output: {
				beautify: true
			}
		}),
		gulp.dest(client_paths.js_dist)
	], function(e) {
		if (e !== undefined)
		{
			console.log(e);
		}
	});

	// vendor
	pump([
		gulp.src(mainBowerFiles()),
		sourcemaps.init(),
		concat('vendor.js'),
		uglify({
			output: {
				beautify: true,
				comments: true
			},
			mangle: false,
			compress: false,
		}),
		sourcemaps.write('maps'),
		gulp.dest(client_paths.js_dist)
	], function(e) {
		if (e !== undefined) {
			console.log(e);
		}
		cb(null);
	});

	return;
});

gulp.task('server_js', function() {
	// user
	pump([
		gulp.src(server_paths.js_build + 'user/*.js'),
		concat('dist.js'),
		uglify({
			mangle: false,
			compress: false,
			output: {
				beautify: true
			}
		}),
		gulp.dest(server_paths.js_dist)
	], function(e) {
		if (e !== undefined)
		{
			console.log(e);
		}
	});

	// vendor
	pump([
		gulp.src(server_paths.js_build + 'vendor/*.js'),
		concat('vendor.js'),
		uglify({
			mangle: false,
			compress: false,
			output: {
				beautify: false
			}
		}),
		gulp.dest(server_paths.js_dist)
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
gulp.task('client_sass', function () {
	pump([
		gulp.src(client_paths.sass + '*.sass'),
		sass({
			includePaths: [client_paths.sass],
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
		gulp.dest(client_paths.css)
	], function(e) {
		if (e !== undefined)
		{
			console.log(e);
		}
	});
	return;
});

gulp.task('server_sass', function () {
	pump([
		gulp.src(server_paths.sass + '*.sass'),
		sass({
			includePaths: [server_paths.sass],
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
		gulp.dest(server_paths.css)
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
gulp.task('client_watch', function () {
	gulp.watch(client_paths.sass + '**/*.sass', ['client_sass']);
	gulp.watch(client_paths.pug + '*.pug', ['client_pug']);
	gulp.watch(client_paths.js_build + '**/*.js', ['client_js']);
});

gulp.task('server_watch', function () {
	gulp.watch(server_paths.sass + '**/*.sass', ['server_sass']);
	gulp.watch(server_paths.pug + '*.pug', ['server_pug']);
	gulp.watch(server_paths.js_build + '**/*.js', ['server_js']);
});

// Build task compile sass and pug.
gulp.task('client_build', ['client_sass', 'client_pug', 'client_js']);
gulp.task('server_build', ['server_sass', 'server_pug', 'server_js']);

/**
 * Default task, running just `gulp` will compile the sass,
 * compile the jekyll site, launch BrowserSync then watch
 * files for changes
 */
gulp.task('default', ['client_build', 'client_watch', 'server_build', 'server_watch']);
