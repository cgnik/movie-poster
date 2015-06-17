var chai = require('chai');
var should = chai.should();

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
	self = {
		get : function(url) {
			console.log("get()");
			return {
				on : function(type, callback) {
					console.log("on()");
					return {
						pipe : function(stream) {
							console.log("pipe()");
							callback();
						}
					};
				}
			}
		}
	};
	fetcher.request = self;
	fetcher.fetch("URIPART", "FILENAME");
	return self;
}
describe('FileFetch', function() {
	fetcher.imageLoc = 'IMAGELOC';
	describe('#getUrl', function() {
		it('should assemble the url BASEw300IMAGELOC', function() {
			assert(fetcher.getUrl() === 'BASEw300IMAGELOC');
		})
	})
	describe('#getExtension', function() {
		it('should return ".ext" for file.ext', function() {
			fetcher.getExtension('file.ext').should.be.equal('.ext');
		})
	})
	describe('#getExtension', function() {
		it('should return "ext" for file.ext', function(done) {
			mockrequest(fetcher, done, function() {
				assert(true === false);
			})
		})
	})
})