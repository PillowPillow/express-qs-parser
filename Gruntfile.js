var paths = {};

var Path = require('path');

paths.base = Path.normalize(__dirname);

function Grunt(grunt) {
	var tasks = ['grunt-develop','grunt-contrib-watch'];

	for (var i = 0; i < tasks.length; i++)
		grunt.loadNpmTasks(tasks[i]);

	require('time-grunt')(grunt);

	var Configuration = {};
	Configuration.package = grunt.file.readJSON('package.json');

	grunt.initConfig(Configuration);

	Configuration.develop = {
		server: {file:'example/app.js'}
	};

	Configuration.watch = {
		app: {
			files: ['example/*.js','index.js'],
			tasks: ['develop:server'],
			options: {
				nospawn: true
			}
		}
	};

	grunt.registerTask('dev', ['develop:server','watch:app']);
}

module.exports = Grunt;