var gulp = require('gulp');
var config = require('../config').watch;

gulp.task('watch', ['connect'], function() {
  gulp.watch([config.scss.src, config.js.src, config.jshint.src, config.scsslint.src, config.kss.src], config.tasks);
});