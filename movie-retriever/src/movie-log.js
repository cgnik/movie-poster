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
				this.target(message);
			}
		},
		level : level,
		levels : [ 'always', 'error', 'info', 'debug' ],
		target : console.log
	}
}
process.argv.forEach(function(val, index, array) {
	if (val == '--debug') {
		console.log('Debug logging enabled');
		loglevel = 'debug';
	} else if (val == '--error') {
		console.log('Error logging enabled');
		exports.loglevel = 'error';
	} else if (val == '--info') {
		console.log('Info logging enabled');
		exports.loglevel = 'info';
	}
});
module.exports = Log(loglevel);
