let MovieMap = require("./movie-map.js");
let Throttle = require('./throttle.js');

const MOVIE_IDS_FILE = 'movie-ids.json';

// configuration
class Indexer {
    constructor(moviedb, dir) {
        this.dir = dir;
        this.movieIds = {};
        this.movieMap = new MovieMap();
        this.db = moviedb;
        this.throttle = new Throttle();

        this.db.on('moviedb:configured', this.enqueueMissingIds);
        this.db.on('moviedb:movie:complete', this.enqueueSearchImage);
        this.db.on('moviedb:poster:complete', this.enqueueFetchImage);
        this.db.on('moviedb:poster:retrieved', this.updateMoviePoster);
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
        if (fs.existsSync(MOVIE_IDS_FILE)) {
            this.movieIds = JSON.parse(fs.readFileSync(
                MOVIE_IDS_FILE, 'utf8'));
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
        console.log(this.throttle);
        this.throttle.add((function () {
            this.db.searchMovies(movieName, this.movieSearchResults.bind(this), this.movieSearchError.bind(this));
        }).bind(this));
    }

    movieSearchError(error) {
        log.error("Unable to find movie match " + error);
    }

    movieSearchResults(movieName, results) {
        let movie = this.movieMap.getMovie(movieName);
        if (movie !== undefined) {
            let bestMatchId = this.db.findBestTitleMatch(movieName, results);
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
                let poster = this.db.findBestPoster(movieId, images);
                log.debugObject(poster);
                let movie = this.movieMap.getMovieById(movieId);
                movie['imageUrl'] = poster;
                this.enqueueFetchImage(movieId);
            }).bind(this));
        }).bind(this));
    }

    enqueueFetchImage(movieId) {
        let movie = this.movieMap.getMovieById(movieId);
        this.throttle.add((function (movie) {
            log.debug("Enqueueing fetch image for " + JSON.stringify(movie));
            this.db.fetchMovieImage(movie);
        }).bind(this, movie));
    }

    updateMoviePoster(movieId, posterImagePath) {
        let movie = this.movieMap.getMovieById(movieId);
    }
}

module.exports = Indexer;