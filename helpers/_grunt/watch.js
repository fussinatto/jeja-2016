module.exports = {
	express: {
		files: [
			'./server/**/*.js'
		],
		tasks: ['express:dev'],
		options: {
			spawn: false
		}
	},
	ajax: {
		files: '<%= paths.src %>/ajax/**/*.{json,html}',
		tasks: 'sync:ajax'
	},
	assets: {
		files: [
			'<%= paths.src %>/assets/**/*'
			],
		tasks: 'sync:assets'
	},
	js: {
		files: [
			'<%= paths.src %>/js/**/*.js'
		],
		tasks: [
			'includes:js'
		]
	},
	scss: {
		files: '<%= paths.src %>/scss/**/*',
		tasks: [
			'sass:dev'
		]
	},
	universal: {
		files: '<%= paths.src %>/scss/universal.scss',
		tasks: 'sass:universal'
	}
};