var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var connect = require('gulp-connect');

gulp.task('connect', function() {
    plugins.connect.server({
        port: 9001,
        root: '../src/styleguide',
        livereload: true
    });
});