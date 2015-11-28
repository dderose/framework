var gulp = require('gulp');
var plumber = require('gulp-plumber');
var sass = require('gulp-sass');
var gulpkss = require('gulp-kss');
var gulpconcat = require('gulp-concat');
var connect = require('gulp-connect');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var config = require('../config.js').kss;

gulp.task('kss', function() {
  gulp.src([config.src])
    .pipe(gulpkss({
        overview: config.overview,
        templateDirectory: config.template
    }))
    .pipe(gulp.dest(config.dest))
    .pipe(connect.reload());

  gulp.src('src/styles/**/*.{sass,scss,css}')
    .pipe(plumber())
    .pipe(sass({
      outputStyle: 'compressed',
      indentedSyntax: false, // Enable .sass syntax?
      imagePath: '/images' // Used by the image-url helper
    }))
    .pipe(gulp.dest(config.publicDir))

  gulp.src('src/js/**/*.js')
    .pipe(plumber())
    .pipe(concat('bundle.js'))
    .pipe(gulp.dest(config.publicDir));

  gulp.src('static/fonts/*')
    .pipe(gulp.dest(config.publicDir));
});