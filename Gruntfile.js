var grunt = require('grunt');
var level = require('level');
var db = level('./.s3-cache');

module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    aws: grunt.file.readJSON('aws.json'),
    's3-sync': {
      options: {
        key: '<%= aws.key %>',
        secret: '<%= aws.secret %>',
        bucket: '<%= aws.bucket %>',
        db: function(){return db;}, //see grunt-s3-sync README
      },
      production: {
        files: [
        //http://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/ServingCompressedFiles.html
        //https://github.com/smallmultiples/grunt-s3-sync/issues/9

          // {
          //   root: __dirname + 'public',
          //   src: ['public/**', '!public/img/**'], //don't compress images
          //   dest: '/',
          //   headers:  {'Cache-Control': 'max-age=315360000, no-transform, public', 'Content-Encoding': 'gzip'},
          //   gzip: true
          // },
          // {
          //   root: __dirname + 'public',
          //   src: ['public/img/**'],
          //   dest: '/',
          //   headers:  {'Cache-Control': 'max-age=315360000, no-transform, public'},
          //   gzip: false
          // },
          {
            root: __dirname + 'public',
            src: ['public/**'],
            dest: '/',
            headers:  {'Cache-Control': 'max-age='+(7*24*60*60)+', no-transform, public'},
            gzip: false
          }
        ]
      }
    },
    invalidate_cloudfront: {
      options: {
        key: '<%= aws.key %>',
        secret: '<%= aws.secret %>',
        distribution: '<%= aws.distribution %>'
      },
      production: {
        files: [{
          expand: true,
          cwd: './public/',
          src: ['**/*'],
          filter: 'isFile',
          dest: ''
        }]
      }
    }
  });

  grunt.loadNpmTasks('grunt-s3-sync');
  grunt.loadNpmTasks('grunt-invalidate-cloudfront');

  grunt.registerTask('deploy', ['s3-sync', 'invalidate_cloudfront']);

  grunt.registerTask('default', 'no-op', function() {
    grunt.log.error(
      'grunt is only used for deployment to AWS CloudFront.\n'+
      'If that\'s what you meant to do, run `grunt deploy`.\n'+
      'If you\'re looking for normal tasks (build, serve), use `gulp`.'
    );
  });
};