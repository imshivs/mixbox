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
        root: __dirname + 'public',
        src: 'public/**',
        dest: '/',
        // gzip: true
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