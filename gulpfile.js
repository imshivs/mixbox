var gulp       = require('gulp');
var uglify     = require('gulp-uglify');
var concat     = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var gulpif     = require('gulp-if');
var wrap       = require("gulp-wrap");
var sass       = require('gulp-sass');
var uncss      = require('gulp-uncss');
var csso       = require('gulp-csso');
var jshint     = require('gulp-jshint');
var gutil      = require('gulp-util');
var jade       = require('gulp-jade');
var del        = require('del');
var swank      = require('swank');
var stylish    = require('jshint-stylish');


var development = !process.env['PRODUCTION'];

var paths = {
  styles  : 'sass',
  scripts : 'lib/**/*.js',
  pages   : 'pages/**/*.jade',
  general : 'src',
  bower   : 'bower_components',
  out     : 'public'
};


gulp.task('clean:scripts', function(cb) {
  del([paths.out+'js/**/*'], cb);
});
gulp.task('clean:styles', function(cb) {
  del([paths.out+'css/**/*'], cb);
});
gulp.task('clean:pages', function(cb) {
  del([paths.out+'/**/*.html'], cb);
});
gulp.task('clean:all', function(cb) {
  del([paths.out+'/**/*'], cb);
});
gulp.task('clean:bower', function(cb) {
  del([paths.out+'vendor/**/*'], cb);
});

gulp.task('scripts', ['clean:scripts'], function() {
  //for all js source files
  gulp.src(paths.scripts)
    //modularize each file with `use strict` statements
    .pipe(wrap('(function () {\n\'use strict\';\n<%= contents %>\n})();'))
    //run jshint (using .jshintrc)
    .pipe(jshint())
    .pipe(jshint.reporter(stylish))
    .pipe(jshint.reporter('fail'))
    //combine to one file
    .pipe(concat('site.js'))
    //wrap in a `document.ready` statement
    .pipe(wrap('jQuery(document).ready(function($){\n<%= contents %>\n});'))
    //sourcemaps only if in development mode
    .pipe(gulpif(development, sourcemaps.init()))
    //minify
    .pipe(uglify())
    .pipe(gulpif(development, sourcemaps.write()))
    .pipe(gulp.dest(paths.out+'/js/'));
});

gulp.task('styles', ['clean:styles'], function () {
    //for all stylesheets
    gulp.src(paths.styles+'/*')
      //sourcemaps only if in development mode
      .pipe(gulpif(development, sourcemaps.init()))
      //compile sass
      .pipe(sass())
      //remove unreferenced styles
      .pipe(uncss({ html: [paths.out+'/*.html'] }))
      //minify
      .pipe(csso())
      .pipe(gulpif(development, sourcemaps.write()))
      .pipe(gulp.dest(paths.out+'/css'));
});

gulp.task('pages', ['clean:pages'], function(){
  gulp.src(paths.pages)
    .pipe(jade())
    .pipe(gulp.dest(paths.out));
});

gulp.task('general', function(){
  gulp.src(paths.general+'/**/*').pipe(gulp.dest(paths.out)); //copy all
});

gulp.task('bower', ['clean:bower'], function(){
  gulp.src(paths.bower+'/**/*').pipe(gulp.dest(paths.out+'/vendor/')); //copy all
});


gulp.task('watch', function() {
  gulp.watch(paths.scripts, ['scripts']);
  gulp.watch(paths.styles,  ['styles']);
  gulp.watch(path.pages,    ['pages']);
  gulp.watch(paths.general, ['general']);
  gulp.watch(paths.bower,   ['bower']);
});

gulp.task('serve', function(cb){
  swank({
    watch: true,
    path: paths.out
  }, function(err, warn, url){
    gutil.log('Server running:', url);
  });
});

gulp.task('build', ['pages', 'scripts', 'styles', 'general', 'bower'])

gulp.task('default', ['clean:all', 'build', 'watch', 'serve']);