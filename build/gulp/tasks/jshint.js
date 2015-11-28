var gulp = require('gulp');
var FileCache = require("gulp-file-cache");
var fileCache = new FileCache();
var jshint = require('gulp-jshint');
var config = require('../config').jshint;

gulp.task('jshint', function() {
    gulp.src(config.src)
        .pipe(fileCache.filter())
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish', { verbose: true }))
        .pipe(fileCache.cache());
});