
// configuration
function Indexer(moviemap, moviedb) {
    this._ = module.require('underscore');
    this.movieIds = {};
    this.movieMap = moviemap;
    this.db = moviedb;
    this.throttle = require('./throttle.js');
};
// note -- if the movie name is already in here, we don't re-search it
Indexer.prototype.initialize = function (params, callback) {
    if (typeof params === 'undefined') {
        params = {};
    }
    merge(this, params);
    this.initMoviedb();
    this.initMovieIds();
    this.db.configure(this.enqueueMissingIds.bind(this));
};
Indexer.prototype.clear = function () {
    this.movieIds = {};
};

Indexer.prototype.initMovieIds = function () {
    // initialize static named movies
    if (fs.existsSync('movie-ids.json')) {
        this.movieIds = JSON.parse(fs.readFileSync(
            'movie-ids.json', 'utf8'));
        log.always("Using static movie IDs ");
        log.debug(this.movieIds);
    }
};
// Overlays the movieIds to the movieMap
Indexer.prototype.applyMovieIdsToMap = function () {
    if (this.movieIds == undefined) {
        return;
    }
    this._.keys(this.movieIds).forEach((function (movieKey) {
        var movie = this.movieMap.getMovie(movieKey);
        if (movie !== undefined) {
            movie.id = this.movieIds[movieKey];
        }
    }).bind(this));
};
// Finds missing ids in moviemap and enqueues fetches
Indexer.prototype.findMissingMovieIds = function () {
    return this.movieMap.toList().filter(function (movie) {
        return movie.id == undefined;
    })
};
// Finds missing posters in moviemap and enqueues fetches
Indexer.prototype.findMissingMovieImages = function () {
    return this.movieMap.toList().filter(function (movie) {
        return movie.image == undefined;
    })
};
Indexer.prototype.enqueueMissingIds = function () {
    this.applyMovieIdsToMap();
    this.findMissingMovieIds().forEach((function (movie) {
        this.enqueueMissingId(movie.name);
    }).bind(this));
    this.throttle.add(this.enqueueSearchImages.bind(this));
};
Indexer.prototype.enqueueMissingId = function (movieName) {
    this.throttle.add((function () {
        this.db.searchMovies(movieName, this.movieSearchResults.bind(this), this.movieSearchError.bind(this));
    }).bind(this));
};
Indexer.prototype.movieSearchError = function (error) {
    log.error("Unable to find movie match ");
};
Indexer.prototype.movieSearchResults = function (movieName, results) {
    movie = this.movieMap.getMovie(movieName);
    if (movie !== undefined) {
        bestMatchId = this.db.findBestTitleMatch(movieName, results);
        if (bestMatchId !== undefined) {
            movie.id = bestMatchId;
        } else {
            this.movieMap.getMovie(movieName).error = "Not Found";
            this.movieMap.getMovie(movieName).results = results;
        }
    } else {
        log.warning("Somehow got result for movie not searched: '" + movieName + "'");
    }
};
Indexer.prototype.enqueueSearchImages = function () {
    this.findMissingMovieImages().forEach((function (movie) {
        this.enqueueSearchImage(movie.id);
    }).bind(this));
};

Indexer.prototype.enqueueSearchImage = function (movieId) {
    this.throttle.add((function () {
        log.info("Enqueueing image fetch for movieId " + movieId);
        this.db.fetchMovieImages(movieId, (function (movieId, images) {
            poster = this.db.findBestPoster(movieId, images);
            log.debugObject(poster);
            movie = this.movieMap.getMovieById(movieId);
            movie['imageUrl'] = poster;
            this.enqueueFetchImage(movieId);
        }).bind(this));
    }).bind(this));
};
Indexer.prototype.enqueueFetchImage = function (movieId) {
    movie = this.movieMap.getMovieById(movieId);
    this.throttle.add((function (movie) {
        this.db.fetchMovieImage(movie);
    }).bind(this, movie));
};

module.exports = Indexer;

