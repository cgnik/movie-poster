var loglevel = 'error';
function Log(level) {
	return {
		debug : function(message) {
			return this.log(message, 'debug')
		},
		info : function(message) {
			return this.log(message, 'info');
		},
		error : function(message) {
			return this.log(message, 'error');
		},
		always : function(message) {
			return this.log(message, 'always');
		},
		log : function(message, level) {
			if (this.levels.indexOf(level) <= this.levels.indexOf(this.level)) {
				console.log(message);
			}
		},
		level : level,
		levels : [ 'always', 'error', 'info', 'debug' ]
	}
}
process.argv.forEach(function(val, index, array) {
	if (val == '--debug') {
		console.log('Debug logging enabled');
		loglevel = 'debug';
	} else if (val == '--error') {
		console.log.always('Error logging enabled');
		exports.loglevel = 'error';
	} else if (val == '--info') {
		console.log.always('Info logging enabled');
		exports.loglevel = 'info';
	}
});
module.exports = Log(loglevel);
