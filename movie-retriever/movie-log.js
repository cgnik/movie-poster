module.exports = {
	debug : function(message) {
		return this.log(message, 'debug')
	},
	info : function(message) {
		return this.log(message, 'info');
	},
	error : function(message) {
		return this.log(message, 'error');
	},
	log : function(message, level) {
		if (this.levels.indexOf(level) <= this.levels.indexOf(this.loglevel)) {
			console.log(message);
		}
	},
	loglevel : 'error',
	levels : [ 'error', 'info', 'debug' ]
}
