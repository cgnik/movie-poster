var loglevel = 'dup';
Log = function(level) {
	var self = {
		levels : {
			'error' : 1,
			'info' : 2,
			'debug' : 3,
			'always' : 4,
		},
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
			if (self.shouldLog(level)) {
				self.target(message);
			}
		},
		getLevel : function() {
			return self.level;
		},
		setLevel : function(level) {
			self.level = level;
		},
		shouldLog : function(lev) {
			console.log(self.levels[self.level] + ": " + self.level + " >= "
					+ self.levels[lev] + ": " + lev);
			return (lev == 'always' || self.level == 'always')
					|| (self.levels[self.level] >= self.levels[lev]);
		}
	}
	return self;
};
process.argv.forEach(function(val, index, array) {
	if (val == '--debug') {
		console.log('Debug logging enabled');
		exports.level = 'debug';
	} else if (val == '--error') {
		console.log('Error logging enabled');
		exports.level = 'error';
	} else if (val == '--info') {
		console.log('Info logging enabled');
		exports.level = 'info';
	}
});
module.exports = Log('durka');
