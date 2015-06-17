var chai = require('chai');
var should = chai.should();
global['log'] = require('../src/movie-log.js');
global['log'].level = 'debug';

fetcher = require('../src/image-fetch.js')({
	baseUrl : 'BASE',
	imagePath : 'IMAGEPATH'
});
var mockfs = function() {
	self = {
		createWriteStream : function(fileName) {
			self.fileName = fileName;
		}
	}
	return self;
}
var mockrequest = function(fetch, callback, errorCallback) {
	var success = false;
	self = {
		get : function(url) {
			return {
				on : function(type, callback) {
					return {
						pipe : function(stream) {
							success = true;
						}
					};
				}
			}
		}
	};
	fetcher.request = self;
	fetcher.fetch("URIPART", "FILENAME");
	callback();
	return success;
}
describe('FileFetch', function() {
	fetcher.imageLoc = 'IMAGELOC';
	describe('#getUrl', function() {
		it('should assemble the url BASEw300IMAGELOC', function(done) {
			assert.equal(fetcher.getUrl(), 'BASEw300IMAGELOC');
			done();
		})
	})
	describe('#getExtension', function() {
		it('should return ".ext" for file.ext', function(done) {
			assert.equal(fetcher.getExtension('file.ext'), '.ext');
			done();
		})
	})
	describe('#getExtension', function() {
		it('should return "ext" for file.ext', function(done) {
			assert(mockrequest(fetcher, done, function() {
				assert(true === false);
			}));
		})
	})
})