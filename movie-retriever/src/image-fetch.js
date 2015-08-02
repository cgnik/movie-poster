var log = global['log'];
path = require('path');
request = require('request');
FileFetch = (function(params) {
	if (params === null) {
		params = {};
	}
	var self = {
		fs : require('fs'),
		fetch : function() {
			url = self.getUrl();
			var fileTarget = self.getTargetFile();
			log.always("Fetching " + fileTarget + " from " + url);
			self.request.get(url).on('error', function(err) {
				log.error(err)
			}).pipe(self.fs.createWriteStream(fileTarget));
		},
		getTargetFile : function() {
			return path.join(path.normalize(self.imagePath), self.fileName
					+ self.getExtension(self.imageLoc));
		},
		getUrl : function() {
			return self.baseUrl + "w300" + self.imageLoc;
		},
		getExtension : function() {
			var extension = '';
			var dotLoc = self.imageLoc.lastIndexOf('.');
			if (dotLoc >= 0) {
				extension = self.imageLoc.substr(dotLoc, self.imageLoc.length
						- dotLoc);
			}
			return extension;
		},
		fileName : '',
		imagePath : '',
		imageLoc : '',
		baseUrl : ''
	};
	if (params != null) {
		Object.keys(params).forEach(function(key) {
			self[key] = params[key];
		})
	}
	return self;
});
module.exports = FileFetch;