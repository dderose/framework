var gulp = require('gulp');
var plumber = require('gulp-plumber');
var connect = require('gulp-connect');

gulp.task('connect', function() {
    connect.server({
        port: 9000,
        root: 'src/styleguide',
        livereload: true
    });
});