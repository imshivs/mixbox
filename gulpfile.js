var gulp       = require('gulp');
var uglify     = require('gulp-uglify');
var concat     = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var gulpif     = require('gulp-if');
var wrap       = require("gulp-wrap");
var sass       = require('gulp-sass');
var uncss      = require('gulp-uncss');
var csso       = require('gulp-csso');
var del        = require('del');
var swank      = require('swank');

var development = !process.env['PRODUCTION'];

var paths = {
  styles  : 'sass',
  scripts : 'lib',
  general : 'src',
  bower   : 'bower_components',
  out     : 'public'
};


gulp.task('clean', function(cb) {
  del([paths.out+'/*'], cb);
});

gulp.task('scripts', function() {
  gulp.src(paths.scripts+'/*.js')
    .pipe(concat('site.js'))
    .pipe(wrap('jQuery(document).ready(function($){<%= contents %>});'))
    .pipe(gulpif(development, sourcemaps.init()))
    .pipe(uglify())
    .pipe(gulpif(development, sourcemaps.write()))
    .pipe(gulp.dest(paths.out+'/js/'));
});

gulp.task('styles', function () {
    gulp.src(paths.styles+'/*')
      .pipe(gulpif(development, sourcemaps.init()))
      .pipe(sass())
      .pipe(uncss({ html: [paths.general+'/index.html'] }))
      .pipe(csso())
      .pipe(gulpif(development, sourcemaps.write()))
      .pipe(gulp.dest(paths.out+'/css'));
});

gulp.task('general', function(){
  gulp.src(paths.general+'/**/*').pipe(gulp.dest(paths.out)); //copy
});

gulp.task('bower', function(){
  gulp.src(paths.bower+'/**/*').pipe(gulp.dest(paths.out+'/vendor/')); //copy
});


gulp.task('watch', function() {
  gulp.watch(paths.scripts, ['scripts']);
  gulp.watch(paths.styles, ['styles']);
  gulp.watch(paths.general, ['general']);
  gulp.watch(paths.bower, ['bower']);
});

gulp.task('serve', function(cb){
  swank({
    watch: true,
    path: paths.out
  }, function(err, warn, url){
    console.log('Server running: '+url);
  });
});

gulp.task('build', ['clean', 'scripts', 'styles', 'general', 'bower'])

gulp.task('default', ['build', 'watch', 'serve']);