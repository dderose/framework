var gulp = require('gulp');
var plumber = require('gulp-plumber');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var config = require('../config.js').js;

gulp.task('js', function() {
  gulp.src(config.src)
    .pipe(plumber())
    // .pipe(sourcemaps.init())
    .pipe(concat('bundle.js'))
    // .pipe(uglify())
    // .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(config.dest))
});