var gulp = require('gulp');
var plumber = require('gulp-plumber');
var FileCache = require("gulp-file-cache");
var fileCache = new FileCache();
var scsslint = require('gulp-scss-lint');
var config = require('../config').scsslint;

gulp.task('scsslint', function() {
    gulp.src([config.src, '!' + config.exclude])
        .pipe(plumber())
        .pipe(fileCache.filter())
        .pipe(scsslint({
            'maxBuffer': config.maxBuffer,
            'config': config.config
        }))
        .pipe(fileCache.cache());
});