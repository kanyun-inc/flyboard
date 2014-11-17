'use strict';
module.exports = function(grunt) {

    grunt.initConfig({
        
        clean: ['dist/*'],

        browserify: {
            js: {
                /* A single entry point the app */
                src: 'js/app.js',

                /* Compile to a single file */
                dest: 'dist/js/app.js',
            },
        },

        copy: {
            all: {
                /* Copy all html into the dist/ folder */
                expand: true,
                src: ['**/*.html', '!node_modules/**'],
                dest: 'dist/',
            }
        },

        concat: {
            main:{
                src: [
                    'dist/js/*.js',
                ],
                dest: 'dist/js/all.js'
            }
        },

        watch: {
            files: ['js/*.js'],
            tasks: ['js']
        }
    });
    
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('js', ['clean', 'browserify', 'concat']);

    // Build task.
    grunt.registerTask('build', ['js', 'copy']);

    grunt.registerTask('default', ['build']);
    
};
