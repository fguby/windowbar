const sass = require('node-sass');

module.exports = function(grunt){
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		sass: {
			options: {
				implementation: sass,
				outputStyle: 'compressed'
			},
			dist: {
				files: {
					'src/style.css': 'src/style.scss'
				}
			}
		},
		minifyHtml: {
			dist: {
				files: {
					'src/windowbar.min.html': 'src/windowbar.html'
				}
			}
		},
		browserify: {
			options: {
				debug: true,
				extensions: '.js',
				browserifyOptions: {
					standalone: 'windowbar'
				},
				transform: ['brfs']
			},
			default: {
				files: { 'dist/index.js': ['src/index.js'] }
			}
		},
		watch: {
			css: {
				files: 'src/style.scss',
				tasks: ['sass']
			},
			html: {
				files: 'src/windowbar.html',
				tasks: ['minifyHtml']
			},
			browserify: {
				files: ['src/index.js', 'src/windowbar.min.html', 'src/style.css'],
				tasks: ['browserify']
			}
		}
	});
	grunt.loadNpmTasks('grunt-sass');
	grunt.loadNpmTasks('grunt-minify-html');
	grunt.loadNpmTasks('grunt-browserify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.registerTask('default', ['watch']);
}
