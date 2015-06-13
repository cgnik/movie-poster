assert = require('assert');
expectedMap = {
	'this' : 'this.jpg',
	'That' : null,
	'that' : 'that.gif',
	'other Thing' : null,
	'which' : null,
	WHAT : null
};
expectedFiles = [ 'this.mp3', 'this.jpg', 'That.mp4', 'that.gif',
		'other Thing.mkv', 'which.m4v', 'WHAT.vOb', 'bother.not' ];
mockfs = function(dir) {
	self = {
		readdirSync : function(dir) {
			return expectedFiles;
		}
	};
	return self;
};
var capture = function(dir) {
	dir.fs = mockfs(".");
	dir.dir = ".";
	return dir.getMovieImageMap();
};

describe('MovieImageMap', function() {
	dir = require('../src/movie-dir.js');
	describe('#getMovieImageMap', function() {
		it('should list movies in dir', function() {
			resp = capture(dir);
			assert.deepEqual(resp, expectedMap);
		})
	})
});