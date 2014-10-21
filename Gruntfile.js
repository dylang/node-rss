'use strict';

module.exports = function(grunt) {

    /**
     * grunt release or grunt release:patch increment the patch number
     * grunt release:minor increments the minor version number
     * grunt release:major increments the major version number
     *

     * grunt readme to generate the readme (you might need to do grunt repos first)
     */


    require('time-grunt')(grunt);

    grunt.initConfig({
        mochaTest: {
            notify: {
                src: 'test/**/*.test.js',
                options: {
                    reporter: 'spec'
                }
            }
        },

        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: [
                'Gruntfile.js',
                'lib/**/*.js',
                'tests/**/*.js'
            ]
        }

    });

    require('load-grunt-tasks')(grunt);

    grunt.registerTask('test', [
        'jshint',
        'mochaTest'
    ]);

    grunt.registerTask('default', [
        'test'
    ]);

    grunt.registerTask('pre-publish', [
        'test',
        'readme'
    ]);
};
