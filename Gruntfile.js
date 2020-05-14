module.exports = function(grunt) {
	
	// Load plugins
	require('load-grunt-tasks')(grunt);
	
	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		copy: {
			main: {
				files: {
					'dist/zoomifyc.js': ['src/zoomifyc.js'],
					'dist/zoomifyc.css': ['src/zoomifyc.css']
				}
			}
		},
		uglify: {
			options: {
				banner: '/*! Zoomifyc - v<%= pkg.version %> - https://github.com/celineWong7/zoomifyc - (c) 2020 Wang Xiaolin - MIT */\n'
			},
			main: {
				files: {
					'dist/zoomifyc.min.js': ['dist/zoomifyc.js']
				}
			}
		},
		cssmin: {
			options: {
				shorthandCompacting: false,
				roundingPrecision: -1
			},
			main: {
				files: {
					'dist/zoomifyc.min.css': ['dist/zoomifyc.css']
				}
			}
		},
		'sync-json': {
			options: {
				include: ['name', 'description', 'version']
			},
			bower: {
				files: {
					"bower.json": "package.json"
				}
			}
		}
	});
	
	// Default tasks.
	grunt.registerTask('default', ['copy', 'uglify', 'cssmin', 'sync-json']);
	
};