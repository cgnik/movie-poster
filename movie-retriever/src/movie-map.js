function MovieMap() {
    this.movies = {};
    this.MOVIE_EXTENSIONS = [".m4v", ".mkv", ".mp4", ".vob", ".mpg", ".mpeg", ".avi"];
    this.IMAGE_EXTENSIONS = [".jpg", ".gif", ".png"];
};

MovieMap.prototype.initialize = function (directory) {
    this.directory = directory;
    this.load();
    this.addMovieFiles(fs.readdirSync(this.directory));
};

MovieMap.prototype.load = function () {
    fstat = fs.statSync('movie-map.json');
    if (fstat && fstat.isFile()) {
        try {
            this.movies = JSON.parse(fs.readFileSync('movie-map.json'));
        } catch (e) {
            log.error("Unable to initialize existing movie-map.json: could not parse - " + e);
        }
    }
};

MovieMap.prototype.persist = function () {
    if (this.movies !== undefined && Object.keys(this.movies).length > 0) {
        fs.createWriteStream(this.directory + 'movie-map.json').write(JSON.stringify(this.movies)).close();
    } else {
        log.info("Skipping map persist -- nothing to write.");
    }
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
    name = this.keyify(mcname);
    // get or create mapped name
    existing = this.movies[name] || {};
    if (existing.name == undefined) {
        existing.name = mcname;
    }
    if (existing.directory == undefined) {
        existing.directory = path.isAbsolute(fileFullName) ? path.dirname(fileFullName) + "/" : this.directory;
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

MovieMap.prototype.getMovieById = function (movieId) {
    movie = null;
    _.keys(this.movies).some((function (key) {
        if (this.movies[key].id === movieId) {
            movie = this.movies[key];
            return true;
        }
    }).bind(this));
    return movie;
}

MovieMap.prototype.isMovieExtension = function (fileName) {
    return this.MOVIE_EXTENSIONS.indexOf(fileName.toLowerCase()) >= 0;
};

MovieMap.prototype.isImageFile = function (fileName) {
    return this.IMAGE_EXTENSIONS.indexOf(fileName.toLowerCase()) >= 0;
};

MovieMap.prototype.setMovieProperties = function (movieId, properties) {
    movie = this.getMovieById(movieId);
    if (movie !== undefined && movie != null) {
        merge(movie, properties);
        return true;
    }
    return false;
};

MovieMap.prototype.keyify = function (s) {
    if (s === undefined) {
        return undefined;
    }
    return s.toString().toLowerCase();
}

module.exports = MovieMap;
