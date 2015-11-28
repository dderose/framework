var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var FileCache = require("gulp-file-cache");
var fileCache = new FileCache();
var config = require('../config').scsslint;

gulp.task('scsslint', function() {
    gulp.src([config.src, '!' + config.exclude])
        .pipe(plugins.plumber())
        .pipe(fileCache.filter())
        .pipe(plugins.scssLint({
            'maxBuffer': config.maxBuffer,
            'config': config.config
        }))
        .pipe(fileCache.cache());
});