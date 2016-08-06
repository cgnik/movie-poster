let MovieMap = require("./movie-map.js");

// configuration
class Indexer {
    constructor(moviedb, dir) {
        this.dir = dir;
        this.movieIds = {};
        this.movieMap = new MovieMap();
        this.db = moviedb;
        this.throttle = require('./throttle.js');
    }

    // note -- if the movie name is already in here, we don't re-search it
    initialize(params) {
        params = params || {};
        this.dir = params.dir || this.dir;
        this.movieMap.initialize(this.dir);
    }

    process() {
        this.initMovieIds();
        this.db.configure(this.enqueueMissingIds.bind(this));
    }

    clear() {
        this.movieIds = {};
    }

    initMovieIds() {
        // initialize static named movies
        if (fs.existsSync('movie-ids.json')) {
            this.movieIds = JSON.parse(fs.readFileSync(
                'movie-ids.json', 'utf8'));
            log.always("Using static movie IDs ");
            log.debug(this.movieIds);
        }
    }

    // Overlays the movieIds to the movieMap
    applyMovieIdsToMap() {
        if (!this.movieIds)
            return;

        Object.keys(this.movieIds).forEach((function (movieKey) {
            var movie = this.movieMap.getMovie(movieKey);
            if (movie !== undefined) {
                movie.id = this.movieIds[movieKey];
            }
        }).bind(this));
    }

    // Finds missing ids in moviemap and enqueues fetches
    findMissingMovieIds() {
        var filtered = this.movieMap.toList().filter(function (movie) {
            return !movie.id;
        });
        return filtered;
    }

    // Finds missing posters in moviemap and enqueues fetches
    findMissingMovieImages() {
        return this.movieMap.toList().filter(function (movie) {
            return !movie.image;
        });
    }

    // Finds movies that have an imageLoc and no image property
    findFetchableImages() {
        return this.movieMap.toList().filter(function (movie) {
            let fetchable = movie.imageLoc !== undefined && movie.image === undefined;
            log.debug("Fetchable? " + JSON.stringify(movie));
            return fetchable;
        });
    }

    enqueueMissingIds() {
        this.applyMovieIdsToMap();
        this.findMissingMovieIds().forEach((function (movie) {
            this.enqueueMissingId(movie.name);
        }).bind(this));
        this.throttle.add(this.enqueueSearchImages.bind(this));
    }

    enqueueMissingId(movieName) {
        this.throttle.add((function () {
            this.db.searchMovies(movieName, this.movieSearchResults.bind(this), this.movieSearchError.bind(this));
        }).bind(this));
    }

    movieSearchError(error) {
        log.error("Unable to find movie match ");
    }

    movieSearchResults(movieName, results) {
        movie = this.movieMap.getMovie(movieName);
        if (movie !== undefined) {
            bestMatchId = this.db.findBestTitleMatch(movieName, results);
            if (bestMatchId) {
                movie.id = bestMatchId;
            } else {
                this.movieMap.getMovie(movieName).error = "Not Found";
                this.movieMap.getMovie(movieName).results = results;
            }
        } else {
            log.warning("Somehow got result for movie not searched: '" + movieName + "'");
        }
    }

    enqueueSearchImages() {
        this.findMissingMovieImages().forEach((function (movie) {
            if (movie.id) {
                this.enqueueSearchImage(movie.id);
            } else {
                log.warn("Skipping image search for no-id movie: " + movie.name);
            }
        }).bind(this));
    }

    enqueueSearchImage(movieId) {
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
    }

    // retrieves all after queue is empty of search Image items
    enqueueFetchImages() {
        this.findFetchableImages().forEach((function (fetchable) {
            if (fetchable.id !== undefined) {
                this.enqueueFetchImage(fetchable.id);
            } else {
                log.warn("Cannot fetch movie with no id: " + JSON.stringify(fetchable));
            }
        }).bind(this));
        this.throttle.add(this.movieMap.persist);
    }

    enqueueFetchImage(movieId) {
        movie = this.movieMap.getMovieById(movieId);
        this.throttle.add((function (movie) {
            log.debug("Enqueueing fetch image for " + JSON.stringify(movie));
            this.db.fetchMovieImage(movie);
        }).bind(this, movie));
    }
}

module.exports = Indexer;
