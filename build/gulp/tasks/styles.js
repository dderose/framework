var gulp = require('gulp');
var mainBowerFiles = require('main-bower-files');
// Include plugins
var plugins = require('gulp-load-plugins')({
	pattern: ['gulp-*', 'gulp.*', 'main-bower-files'],
	replaceString: /\bgulp[\-.]/
});
var config = require('../config.js').sass;

gulp.task('styles', function() {
	gulp.src(mainBowerFiles().concat(config.src))
		.pipe(plugins.plumber())
		.pipe(plugins.filter('*.css'))
		.pipe(plugins.sourcemaps.init())
		.pipe(plugins.sass(config.settings))
		.pipe(plugins.sourcemaps.write('./'))
		.pipe(gulp.dest(config.dest))
});
