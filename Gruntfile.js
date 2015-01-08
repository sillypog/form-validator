'use strict';

module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		jasmine: {
			all: {
				src: 'src/**/*.js',
				options: {
					specs: 'spec/**/*_spec.js'
				}
			}
		},
		jshint: {
			all: ['Gruntfile.js', 'src/**/*.js', 'spec/**/*.js'],
			options: {
				jshintrc: '.jshintrc',
				reporter: require('jshint-stylish')
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-jasmine');
	grunt.loadNpmTasks('grunt-contrib-jshint');

	grunt.registerTask('test', ['jshint', 'jasmine']);
};
