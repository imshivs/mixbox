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
        db: function(){return db;},
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

  grunt.registerTask('aws', ['s3-sync', 'invalidate_cloudfront']);
};