// local movies library -- functions re: movie dir
require('./globals.js');
var MOVIE_EXTENSIONS = [".m4v", ".mkv", ".mp4", ".vob", ".mpg", ".mpeg"];
var IMAGE_EXTENSIONS = [".jpg", ".gif", ".png"];
MovieMap = function (directory) {
    this.directory = directory;
    this.movieMap = {};
}

MovieMap.prototype.toList = function () {
    return _.map(this.movieMap, function (k, v) {
        return k;
    });
};

MovieMap.prototype.clear = function () {
    this.movieMap = {};
};

MovieMap.prototype.addMovieFiles = function (files) {
    files.forEach((function (fileFullName) {
        this.addMovieFile(fileFullName);
    }).bind(this));
};
MovieMap.prototype.addMovieFile = function (fileFullName) {
    // figure out pieces parts of file name
    extname = path.extname(fileFullName);
    mcname = path.basename(fileFullName, extname);
    name = mcname.toLowerCase();
    // get or create mapped name
    existing = this.movieMap[name] || {};
    if (existing.name == undefined) {
        existing.name = mcname;
    }
    // shuffle in the right props
    if (this.isMovieExtension(extname)) {
        existing.file = fileFullName;
        this.movieMap[name] = existing;
    } else if (this.isImageFile(extname)) {
        existing.image = fileFullName;
        this.movieMap[name] = existing;
    } else {
        log.info("Skipping non-image-non-movie file: " + fileFullName);
    }
};
MovieMap.prototype.getMovie = function (movieName) {
    return this.movieMap[movieName];
};
MovieMap.prototype.isMovieExtension = function (fileName) {
    return MOVIE_EXTENSIONS.indexOf(fileName.toLowerCase()) >= 0;
};
MovieMap.prototype.isImageFile = function (fileName) {
    return IMAGE_EXTENSIONS.indexOf(fileName.toLowerCase()) >= 0;
};
MovieMap.prototype.setMovieProperties = function (movieId, properties) {
    movie = _.keys(this.movieMap).some((function (key) {
        if (this.movieMap[key].id === movieId) {
            merge(this.movieMap[key], properties);
            return true;
        }
    }).bind(this));
};
module.exports = MovieMap;
