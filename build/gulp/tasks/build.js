var gulp = require('gulp');
var config = require('../config').watch;

gulp.task('build', ['styles', 'js', 'jshint', 'scsslint', 'kss'], function() {});