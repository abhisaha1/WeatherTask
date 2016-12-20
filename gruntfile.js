module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        less: {
            all: {
                files: {
                    "./dist/css/main.css": "./src/less/main.less"
                }
            }
        },

        cssmin: {
          build: {
            files: {
              'dist/css/main.min.css': 'dist/css/main.css'
            }
          }
        },

        browserify: {
          dist: {
            files: {
              'dist/js/bundle.js': ['src/js/main.js']
            }
          }
        },
        
        watch: {
            less: {
                files: ['**/*.less'],
                tasks: ['less', 'cssmin'],
                options: {
                    spawn: false
                }
            },
            js: {
                files: ['src/js/main.js'],
                tasks: ['browserify'],
                options: {
                    spawn: false
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.registerTask('default', ['less', 'cssmin']);
};
