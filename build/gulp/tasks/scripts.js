var gulp = require('gulp');
var mainBowerFiles = require('main-bower-files');
// Include plugins
var plugins = require('gulp-load-plugins')({
	pattern: ['gulp-*', 'gulp.*', 'main-bower-files'],
	replaceString: /\bgulp[\-.]/
});
var config = require('../config.js').js;

gulp.task('js', function() {
	gulp.src(mainBowerFiles().concat(config.src))
		.pipe(plugins.plumber())
		.pipe(plugins.order([
			'jquery.js',
			'*'
		]))
		.pipe(plugins.sourcemaps.init())
		.pipe(plugins.concat('bundle.js'))
		.pipe(plugins.uglify())
		.pipe(plugins.sourcemaps.write('./'))
		.pipe(gulp.dest(config.dest))
});