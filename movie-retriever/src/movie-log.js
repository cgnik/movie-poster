var loglevel = 'error';
Log = function(level) {
	var self = {
		levels : [ 'always', 'debug', 'info', 'error' ],
		target : console.log,
		debug : function(message) {
			return self.log(message, 'debug')
		},
		info : function(message) {
			return self.log(message, 'info');
		},
		error : function(message) {
			return self.log(message, 'error');
		},
		always : function(message) {
			return self.log(message, 'always');
		},
		log : function(message, level) {
			console.log(self.levels.indexOf(self.level) + ": " + self.level
					+ " <= " + self.levels.indexOf(level) + ": " + level);
			if (level == 'always'
					|| self.level == 'always'
					|| self.levels.indexOf(self.level) <= self.levels
							.indexOf(level)) {
				self.target(message);
			}
		}
	}
	return self;
};
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
module.exports = Log('error');
