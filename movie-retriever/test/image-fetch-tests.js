var chai = require('chai');
var should = chai.should();
global['log'] = require('../src/movie-log.js');
global['log'].level = 'debug';

var mockfs = function() {
	self = {
		createWriteStream : function(fileName) {
			self.fileName = fileName;
		}
	}
	return self;
}
var mockrequest = function(fetch, errorCallback) {
	var success = false;
	var url = fetcher.getUrl();
	var targetFile = fetcher.getTargetFile();
	self = {
		get : function(url) {
			console.log('get');
			return {
				on : function(type, callback) {
					console.log('on');
					return {
						pipe : function(stream) {
							console.log('fetch success');
							success = true;
						}
					};
				}
			}
		}
	};
	
	fetcher.request = self;
	fetcher.fetch();
	return success;
}
ffetcher = function() {
	return require('../src/image-fetch.js')({
		baseUrl : 'BASEURL',
		imagePath : 'IMAGE/PATH',
		imageLoc : 'IMAGE/LOC',
		fileName : 'FILENAME'
	})
};
describe('FileFetch', function() {
	describe('#getUrl', function() {
		it('should assemble the url BASEURLw300IMAGE/LOC', function() {
			ffetcher().getUrl().should.equal('BASEURLw300IMAGE/LOC');
		})
	})
	describe('#getExtension', function() {
		it('should return ".ext" for file.ext', function() {
			fetcher = ffetcher();
			fetcher.imageLoc = 'file.ext';
			fetcher.getExtension().should.equal('.ext');
		})
		it('should return "" for file', function() {
			fetcher = ffetcher();
			fetcher.imageLoc = 'file';
			fetcher.getExtension().should.equal('');
		})
	})
	describe('#getTargetFile', function() {
		it('should return "IMAGE/PATH/target.ext" for IMAGE/LOC, file',
				function() {
					fetcher = ffetcher();
					fetcher.imageLoc = 'file.ext';
					fetcher.imagePath = 'IMAGE/PATH';
					fetcher.fileName = 'target';
					fetcher.getTargetFile().should
							.equal('IMAGE/PATH/target.ext');
				})
	})
	describe('#fetch', function() {
		it('should return success', function() {
			assert(mockrequest(ffetcher(), function() {
				assert(true === false);
			}));
		})
	})
})
