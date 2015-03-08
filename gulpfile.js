var gulp          = require('gulp');
var uglify        = require('gulp-uglify');
var concat        = require('gulp-concat');
var sourcemaps    = require('gulp-sourcemaps');
var gulpif        = require('gulp-if');
var wrap          = require("gulp-wrap");
var sass          = require('gulp-sass');
var uncss         = require('gulp-uncss');
var csso          = require('gulp-csso');
var jshint        = require('gulp-jshint');
var gutil         = require('gulp-util');
var jade          = require('gulp-jade');
var imagemin      = require('gulp-imagemin');
var autoprefixer  = require('gulp-autoprefixer');
var del           = require('del');
var swank         = require('swank');
var stylish       = require('jshint-stylish');
var inlineimg     = require('gulp-inline-image');
var inlineimghtml = require('gulp-inline-image-html');

var development = (process.env['NODE_ENV'] !== 'production'); // set this env var in prod

/********** PATHS **********/
var out_path = 'public';
var paths = {
  styles: {
    src: 'src/_sass/*',
    dest: out_path+'/css/'
  },
  scripts:{
    src: 'src/_js/**/*.js',
    dest: out_path+'/js/'
  },
  pages:{
    src: 'src/_jade/**/*.jade',
    dest: out_path,
    all: [out_path+'/*.html', out_path+'/!(vendor)/**/*.html']
  },
  general:{
    src: ['src/!(_*)', 'src/!(_*)/**/*'], //will match any file/directory not begining with `_`
    dest: out_path
  },
  images: {
    src: 'src/_img/**/*',
    dest: out_path+'/img'
  },
  bower:{
    src: 'bower_components/**/*',
    dest: out_path+'/vendor'
  }
};

/********** CLEAN **********/
gulp.task('clean:scripts', function(cb) {
  del(paths.scripts.dest, cb);
});
gulp.task('clean:styles', function(cb) {
  del(paths.styles.dest, cb);
});
gulp.task('clean:pages', function(cb) {
  del(paths.pages.all, cb);
});
gulp.task('clean:bower', function(cb) {
  del(paths.bower.dest, cb);
});
gulp.task('clean:images', function(cb){
  del(paths.images.dest, cb);
});
gulp.task('clean:all', function(cb) {
  del([out_path+'/**/*', '!'+out_path+'/.gitkeep'], cb);
});

/********** BUILD **********/
gulp.task('scripts', ['clean:scripts'], function () {
  gulp.src(paths.scripts.src)
    .pipe(wrap('(function () {\n\'use strict\';\n<%= contents %>\n})();')) //modularize each file with `use strict` statements
    .pipe(jshint()) //run jshint (using .jshintrc)
    .pipe(jshint.reporter(stylish))
    // .pipe(jshint.reporter('fail')) //stop if jshint doesn't pass
    .pipe(concat('site.js')) //combine to one file
    .pipe(wrap('jQuery(document).ready(function($){\n<%= contents %>\n});')) //wrap in a `document.ready` statement
    .pipe(gulpif(development, sourcemaps.init())) //sourcemaps only if in development mode
    .pipe(uglify()) //minify
    .pipe(gulpif(development, sourcemaps.write()))
    .pipe(gulp.dest(paths.scripts.dest));
});

gulp.task('styles', ['clean:styles'], function () {
    gulp.src(paths.styles.src)
      .pipe(gulpif(development, sourcemaps.init())) //sourcemaps only if in development mode
      .pipe(sass()) //compile sass
      .pipe(autoprefixer())
      // .pipe(uncss({ html: paths.pages.all })) //remove unreferenced styles
      // .pipe(inlineimg()) //embed images in css
      // .pipe(csso()) //minify
      .pipe(gulpif(development, sourcemaps.write()))
      .pipe(gulp.dest(paths.styles.dest));
});

gulp.task('pages', ['clean:pages'], function (){
  gulp.src(paths.pages.src)
    .pipe(jade())
    // .pipe(inlineimghtml('src'))
    .pipe(gulp.dest(paths.pages.dest));
});

gulp.task('general', function (){
  gulp.src(paths.general.src).pipe(gulp.dest(paths.general.dest)); //copy all
});

gulp.task('bower', ['clean:bower'], function (){
  gulp.src(paths.bower.src).pipe(gulp.dest(paths.bower.dest)); //copy all
});

gulp.task('images', ['clean:images'], function (){
  gulp.src(paths.images.src)
    .pipe(imagemin({
      progressive: true,
    }))
    .pipe(gulp.dest(paths.images.dest));
});

/********** RUN **********/

var resources = ['general', 'pages', 'scripts', 'styles', 'images', 'bower'];

gulp.task('watch', function () {
  resources.forEach(function(r){
    gulp.watch(paths[r].src, [r]); //e.g. gulp.watch(paths.scripts.src, ['scripts']);
  });
});

gulp.task('serve', function(cb){
  swank({
    watch: true,
    path: out_path,
    log: true
  }, function(err, warn, url){
    gutil.log('Server running:', url);
    cb();
  });
});

// To push static content to s3 for CloudFront CDN, use grunt deploy

gulp.task('build', resources);

gulp.task('default', ['build', 'watch', 'serve']);