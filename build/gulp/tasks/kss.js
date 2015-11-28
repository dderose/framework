var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var config = require('../config.js').kss;

gulp.task('kss', function() {
  gulp.src([config.src])
    .pipe(plugins.kss({
        overview: config.overview,
        templateDirectory: config.template
    }))
    .pipe(gulp.dest(config.dest))
    .pipe(plugins.connect.reload());

  gulp.src('src/styles/**/*.{sass,scss,css}')
    .pipe(plugins.plumber())
    .pipe(plugins.sass({
      outputStyle: 'compressed',
      indentedSyntax: false, // Enable .sass syntax?
      imagePath: '/images' // Used by the image-url helper
    }))
    .pipe(gulp.dest(config.publicDir))

  gulp.src('src/js/**/*.js')
    .pipe(plugins.plumber())
    .pipe(plugins.concat('bundle.js'))
    .pipe(gulp.dest(config.publicDir));

  gulp.src('static/fonts/*')
    .pipe(gulp.dest(config.publicDir));
});