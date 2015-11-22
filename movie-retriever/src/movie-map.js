function MovieMap() {
    this.movies = {};
    this.MOVIE_EXTENSIONS = [".m4v", ".mkv", ".mp4", ".vob", ".mpg", ".mpeg"];
    this.IMAGE_EXTENSIONS = [".jpg", ".gif", ".png"];
};

MovieMap.prototype.initialize = function (directory) {
    this.directory = directory;
    this.addMovieFiles(fs.readdirSync(this.directory));
};

MovieMap.prototype.toList = function () {
    return _.map(this.movies, function (k, v) {
        return k;
    });
};

MovieMap.prototype.clear = function () {
    this.movies = {};
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
    existing = this.movies[name] || {};
    if (existing.name == undefined) {
        existing.name = mcname;
    }
    // shuffle in the right props
    if (this.isMovieExtension(extname)) {
        existing.file = fileFullName;
        this.movies[name] = existing;
    } else if (this.isImageFile(extname)) {
        existing.image = fileFullName;
        this.movies[name] = existing;
    } else {
        log.info("Skipping non-image-non-movie file: " + fileFullName);
    }
};

MovieMap.prototype.getMovie = function (movieName) {
    return this.movies[this.keyify(movieName)];
};

MovieMap.prototype.isMovieExtension = function (fileName) {
    return this.MOVIE_EXTENSIONS.indexOf(fileName.toLowerCase()) >= 0;
};

MovieMap.prototype.isImageFile = function (fileName) {
    return this.IMAGE_EXTENSIONS.indexOf(fileName.toLowerCase()) >= 0;
};

MovieMap.prototype.setMovieProperties = function (movieId, properties) {
    movie = _.keys(this.movies).some((function (key) {
        if (this.movies[key].id === movieId) {
            merge(this.movies[key], properties);
            return true;
        }
    }).bind(this));
};

MovieMap.prototype.keyify = function (s) {
    if (s === undefined) {
        return undefined;
    }
    return s.toString().toLowerCase();
}

module.exports = MovieMap;
