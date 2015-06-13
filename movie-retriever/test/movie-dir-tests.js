assert = require('assert');

var mockfs = function(dir) {
	self = {
		readdirSync : function(dir) {
			return {
				readdirSync : function(dir) {
					return [ 'this.mp3', 'this.jpg', 'That.mp4', 'that.gif',
							'other Thing.mkv', 'which.m4v', 'WHAT.vOb',
							'bother.not' ];
				}
			};
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
			assert(capture(dir) === {
				'this' : 'this.jpg',
				'that' : 'That.mp4',
				'other Thing' : null,
				'which' : null,
				'WHAT' : null
			});
		})
	})
});