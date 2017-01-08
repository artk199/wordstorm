module.exports = function (grunt) {
    grunt.initConfig({
		copy: {
			wordstorm: {
				files: [
					{cwd: 'angular',  src: '**/*.json', dest: 'release/angular', expand: true},
					{cwd: 'style',  src: '**/*.*', dest: 'release/style', expand: true},
					{cwd: 'libs',  src: 'bootstrap/fonts/*.*', dest: 'release/libs', expand: true},
					{cwd: 'images',  src: '**/*.*', dest: 'release/images', expand: true},
					{cwd: 'download',  src: '**/*.*', dest: 'release/download', expand: true},
					{src: 'index.min.html', dest: 'release/index.html'},
				]
			}
		},
		uglify: {
			wordstorm: {
				src: [
					'angular/app.js',
					'angular/config/**/*.js',
					'angular/services/**/*.js',
					'angular/filters/**/*.js',
					'angular/pages/**/*.js',
					'angular/components/**/*.js',
					'release/templates.js'
				],
				dest: 'release/wordstorm.min.js',
				flatten: true
			},
			vendor: {
				src: [
					'libs/jquery/*.js',
					'libs/progressbar/*.js',
					'libs/angular/**/*.js',
					'angular/modules/**/*.js',
					'libs/cookies-popup/*.js',
					'libs/bootstrap/js/bootstrap.min.js'
				],
				dest: 'release/vendor.min.js',
				flatten: true
			}
		},
		cssmin: {
			options: {
				shorthandCompacting: false,
				roundingPrecision: -1
			},
			combine: {
				files: {
				  'release/wordstorm.min.css': ['style/css/*.css', '!css/*.min.css', '!style/css/fonts.css'],
				  'release/vendor.min.css': ['libs/**/*.css', 'angular/modules/**/*.css']
				}
			}
		},
		ngtemplates:  {
		  app:        { cwd: 'angular', src: '**/*.html', dest: 'release/templates.js'},
		  options:    {
			  htmlmin:  { 
			      collapseBooleanAttributes:      true,
				  collapseWhitespace:             true,
				  removeAttributeQuotes:          true,
				  removeComments:                 true,
				  removeEmptyAttributes:          true,
				  removeRedundantAttributes:      true,
				  removeScriptTypeAttributes:     true,
				  removeStyleLinkTypeAttributes:  true
			  },
			  module: "wordStormApp",
			  bootstrap:  function(module, script) {
				return '(function () {angular.module("' + module + '").run(["$templateCache", function($templateCache) { ' + script + ' }])}());';
			  },
			  url:    function(url) { return "angular/" + url; }
		  }
		}
});

// load plugins
grunt.loadNpmTasks('grunt-contrib-watch');
grunt.loadNpmTasks('grunt-contrib-uglify');
grunt.loadNpmTasks('grunt-contrib-cssmin');
grunt.loadNpmTasks('grunt-contrib-copy');
grunt.loadNpmTasks('grunt-angular-templates');

// register at least this one task
grunt.registerTask('default', [ 'ngtemplates', 'uglify', 'cssmin', 'copy' ]);
}; 