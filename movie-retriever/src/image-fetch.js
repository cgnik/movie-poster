var log = global['log'];
FileFetch = function(params) {
	if (params === null) {
		params = {};
	}
	var self = {
		request : require('request'),
		fs : require('fs'),
		fetch : function(imageLoc, fileName) {
			url = self.getUrl();
			ext = self.getExtension(imageLoc);
			fileDestination = self.imagePath + fileName;
			log.always("Fetching " + fileDestination + " from " + url);
			self.request.get(url).on('error', function(err) {
				log.error(err)
			}).pipe(self.fs.createWriteStream(fileDestination));
		},
		getUrl : function() {
			return self.baseUrl + "w300" + self.imageLoc;
		},
		getExtension : function(fileName) {
			dotLoc = fileName.lastIndexOf('.');
			ext = fileName.substr(dotLoc, fileName.length - dotLoc);
			return ext;
		},
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
}
module.exports = FileFetch;