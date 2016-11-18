module.exports = function (grunt) {
    grunt.initConfig({
		uglify: {
			wordstorm: {
				src: [
					'angular/app.js',
					'angular/config/**/*.js',
					'angular/services/**/*.js',
					'angular/filters/**/*.js',
					'angular/pages/**/*.js',
					'angular/components/**/*.js'
				],
				dest: 'wordstorm.min.js',
				flatten: true,  
			}
		},
		cssmin: {
		  options: {
			shorthandCompacting: false,
			roundingPrecision: -1
		  },
		  combine: {
			files: {
			  'wordstorm.min.css': ['style/css/*.css', '!css/*.min.css']
			}
		  }
		}
});

// load plugins
grunt.loadNpmTasks('grunt-contrib-watch');
grunt.loadNpmTasks('grunt-contrib-uglify');
grunt.loadNpmTasks('grunt-contrib-cssmin');

// register at least this one task
grunt.registerTask('default', [ 'uglify', 'cssmin' ]);
};