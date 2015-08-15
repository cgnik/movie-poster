require('./util.js');
FileFetch = (function (params) {
    if (params === null) {
        params = {};
    }
    var self = {
        fetch: function () {
            url = self.getUrl();
            var fileTarget = self.getTargetFile();
            log.info("Fetching " + fileTarget + " from " + url);
            self.http.get(url).on('error', function (error) {
                log.error(error)
            }).pipe(self.fs.createWriteStream(fileTarget));
        },
        getTargetFile: function () {
            return self.path.join(self.path.normalize(self.imagePath), self.fileName
                + self.getExtension(self.imageLoc));
        },
        getUrl: function () {
            return self.baseUrl + "w300" + self.imageLoc;
        },
        getExtension: function () {
            var extension = '';
            var dotLoc = self.imageLoc.lastIndexOf('.');
            if (dotLoc >= 0) {
                extension = self.imageLoc.substr(dotLoc, self.imageLoc.length
                    - dotLoc);
            }
            return extension;
        },
        fileName: '',
        imagePath: '',
        imageLoc: '',
        baseUrl: ''
    };
    self.fs = require('fs');
    self.path = require('path');
    self.http = require('http');
    merge(self, params);
    return self;
});
module.exports = FileFetch;