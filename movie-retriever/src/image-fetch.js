ImageFetch = function (params) {
    if (params === null) {
        params = {};
    }
    this.fileName = '';
    this.imagePath = '';
    this.imageLoc = '';
    this.baseUrl = '';
    merge(this, params);
};

ImageFetch.prototype.fetch = function () {
    url = this.getUrl();
    var fileTarget = this.getTargetFile();
    log.info("Fetching '" + fileTarget + "' from '" + url + "'");

    dest = fs.createWriteStream(fileTarget);
    http
        .get(url, function (res) {
            res.on('data', function (data) {
                dest.write(data);
            });
            res.on('end', function () {
                log.always("Wrote " + fileTarget);
                dest.close();
            });
        })
        .on('error', function (error) {
            log.error(error);
        });
};

ImageFetch.prototype.getTargetFile = function () {
    return path.join(path.normalize(this.imagePath), this.fileName
        + this.getExtension(this.imageLoc));
};

ImageFetch.prototype.getUrl = function () {
    return this.baseUrl + "w300" + this.imageLoc;
};

ImageFetch.prototype.getExtension = function () {
    var extension = '';
    var dotLoc = this.imageLoc.lastIndexOf('.');
    if (dotLoc >= 0) {
        extension = this.imageLoc.substr(dotLoc, this.imageLoc.length
            - dotLoc);
    }
    return extension;
};

module.exports = ImageFetch;