// modules
Queue = require('./moviedb-moviedb.js');

// configuration
function Indexer(moviemap) {
    this._ = module.require('underscore');
    this.movieIds = {};
    this.movieMap = moviemap;
    this.throttle = require('./throttle.js');
};
// note -- if the movie name is already in here, we don't re-search it
Indexer.prototype.initialize = function (params) {
    if (typeof params === 'undefined') {
        params = {};
    }
    merge(this, params);
    this.initMoviedb();
    this.initMovieIds();
};
Indexer.prototype.clear = function () {
    this.movieIds = {};
};
Indexer.prototype.initMoviedb = function () {
    if (this.themoviedbKey == undefined) {
        this.themoviedbKey = fs.readFileSync('themoviedb-key.txt');
    }
    this.moviedb = new Queue({'themoviedbKey': this.themoviedbKey});
    if (this.moviedb === undefined) {
        throw new Error("Unable to initialize moviedb searching");
    }
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
        this.movieMap.setMovieProperties(movieKey, {'id': this.movieIds[movieKey]});
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
    log.info("Enqueueing missing movie images");
    return this.movieMap.toList().filter(function (movie) {
        return movie.image == undefined;
    })
};
Indexer.prototype.enqueueMissingIds = function () {
    this.applyMovieIdsToMap();
    this.findMissingMovieIds().forEach((function (movie) {
        this.enqueueMissingId(movie.name);
    }).bind(this));
    this.throttle.add(this.findMissingMovieImages.bind(this));
};
Indexer.prototype.enqueueMissingId = function (movieName) {
    this.throttle.add((function () {
        this.moviedb.searchMovies(movieName, this.movieSearchResults.bind(this), this.movieSearchError.bind(this));
    }).bind(this));
};
Indexer.prototype.movieSearchError = function (error) {
    log.error("Unable to find movie match ");
    console.log(error);
};
Indexer.prototype.movieSearchResults = function (movieName, results) {
    bestMatch = this.moviedb.findBestTitleMatch(movieName, results);
    if (bestMatch) {
        this.movieMap.getMovie(movieName).id = bestMatch.id;
    } else {
        this.movieMap.getMovie(movieName).error = "Not Found";
        this.movieMap.getMovie(movieName).results = results;
    }
}
Indexer.prototype.enqueueMissingImage = function (movieId) {
    this.throttle.add(function () {
        this.moviedb.fetchMovieImages(movieId, function (movieId, images) {
            poster = this.moviedb.findBestPoster(movieId, images);
            this.movieMap.setMovieProperties(movieId, {
                'imageUrl': poster
            });
        });
    });
};
Indexer.prototype.enqueueFetchImages = function (movieId) {
    this.throttle.add(function () {
        movie = this.movieMap.getMovie(movieId);
        props = {
            fileName: '',
            imagePath: '',
            imageLoc: '',
            baseUrl: ''
        };
        fetch = require('./image-fetch.js')(props);
        fetch.fetch();
    })
}

module.exports = Indexer;

