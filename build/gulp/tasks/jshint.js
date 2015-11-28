var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var FileCache = require("gulp-file-cache");
var fileCache = new FileCache();
var config = require('../config').jshint;

gulp.task('jshint', function() {
    gulp.src(config.src)
        .pipe(fileCache.filter())
        .pipe(plugins.jshint())
        .pipe(plugins.jshint.reporter('jshint-stylish', { verbose: true }))
        .pipe(fileCache.cache());
});