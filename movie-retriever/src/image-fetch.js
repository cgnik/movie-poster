class ImageFetch {
    constructor(params) {
        if (params === null) {
            params = {};
        }
        this.fileName = '';
        this.imagePath = '';
        this.imageLoc = '';
        this.baseUrl = '';
        merge(this, params);
    }

    fetch() {
        let url = this.getUrl();
        let fileTarget = this.getTargetFile();
        log.info("Fetching '" + fileTarget + "' from '" + url + "'");

        let dest = fs.createWriteStream(fileTarget);
        http.get(url, function (res) {
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
    }

    getTargetFile() {
        return path.join(path.normalize(this.imagePath), this.fileName
            + this.getExtension(this.imageLoc));
    }

    getUrl() {
        return this.baseUrl + "w300" + this.imageLoc;
    }

    getExtension() {
        var extension = '';
        if (this.imageLoc == null || this.imageLoc === undefined) {
            return;
        }
        var dotLoc = this.imageLoc.lastIndexOf('.');
        if (dotLoc >= 0) {
            extension = this.imageLoc.substr(dotLoc, this.imageLoc.length
                - dotLoc);
        }
        return extension;
    }
}

module.exports = ImageFetch;