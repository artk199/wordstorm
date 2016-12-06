module.exports = function (grunt) {
    grunt.initConfig({
		copy: {
			wordstorm: {
				files: [
					{cwd: 'angular',  src: '**/*.html', dest: 'release/angular', expand: true},
					{cwd: 'angular',  src: '**/*.json', dest: 'release/angular', expand: true},
					{cwd: 'angular/modules',  src: '**/*.*', dest: 'release/angular/modules', expand: true},
					{cwd: 'style',  src: '**/*.*', dest: 'release/style', expand: true},
					{cwd: 'libs',  src: '**/*.*', dest: 'release/libs', expand: true},
					{cwd: 'images',  src: '**/*.*', dest: 'release/images', expand: true},
					{cwd: '',  src: 'index.html', dest: 'release', expand: true},
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
					'angular/components/**/*.js'
				],
				dest: 'release/wordstorm.min.js',
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
			  'release/wordstorm.min.css': ['style/css/*.css', '!css/*.min.css']
			}
		  }
		}
});

// load plugins
grunt.loadNpmTasks('grunt-contrib-watch');
grunt.loadNpmTasks('grunt-contrib-uglify');
grunt.loadNpmTasks('grunt-contrib-cssmin');
grunt.loadNpmTasks('grunt-contrib-copy');

// register at least this one task
grunt.registerTask('default', [ 'uglify', 'cssmin', 'copy' ]);
};