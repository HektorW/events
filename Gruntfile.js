/* global module */

module.exports = function(grunt) {
  "use strict";

  require('time-grunt')(grunt);
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    app: {
      dev: 'src',
      dist: 'dist',
      tmp: 'tmp'
    },

    clean: {
      prebuild: {
        files: [{
          dot: true,
          src: [
            '<%= app.tmp %>',
            '<%= app.dist %>'
          ]
        }]
      },
      postbuild: {
        files: [{
          dot: true,
          src: [
            '<%= app.tmp %>'
          ]
        }]
      }
    },

    copy: {
      prebuild: {
        files: [{
          expand: true,
          cwd: 'src',
          src: ['**'],
          dest: 'tmp/'
        }]
      },
      postbuild: {
        files: [{
          expand: true,
          cwd: 'tmp',
          src: ['**'],
          dest: 'dist/'
        }]
      }
    },

    uglify: {
      dist: {
        files: {
          'dist/events.min.js': ['tmp/events.js'],
          'dist/deferredevents.min.js': ['tmp/deferredevents.js']
        }
      }
    }

  });

  grunt.registerTask('dist', [
    'clean:prebuild',
    'copy:prebuild',
    'uglify:dist',
    'copy:postbuild',
    'clean:postbuild'
  ]);

  grunt.registerTask('default', [
    'dist'
  ]);
};