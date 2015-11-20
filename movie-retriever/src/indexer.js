// modules
queue = module.require('./moviedb-moviedb.js');
moviedb = module.require("moviedb");
throttle = module.require('./throttle.js');

var _ = module.require('underscore');
var count = 1;
// configuration
function Indexer(moviemap) {
    this.movieIds = {};
    this.movieMap = moviemap;
    this.throttle = throttle;
};
// note -- if the movie name is already in here, we don't re-search it
Indexer.prototype.initialize = function (params) {
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
    this.moviedb = queue({'themoviedbKey': this.themoviedbKey});
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
    if( this.movieIds == undefined) {
        return;
    }
    _.keys(this.movieIds).forEach((function (movieKey) {
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
    return this.movieMap.toList().filter(function (movie) {
        return movie.image == undefined;
    })
};
Indexer.prototype.enqueueMissingIds = function () {
    this.applyMovieIdsToMap();
    this.findMissingMovieIds().forEach(function (movie) {
        this.enqueueMissingId(movie.name);
    });
};
Indexer.prototype.enqueueMissingId = function (movieName) {
    throttle.add(this.moviedb.searchMovies(movieName, function (movieName, results) {
        bestMatch = this.moviedb.findBestTitleMatch(movieName, results);
        if (bestMatch) {
            this.movieMap.movieMap[movieName].id = bestMatch.id;
        } else {
            this.movieMap.movieMap[movieName].error = "Not Found";
            this.movieMap.movieMap[movieName].results = results;
        }
    }, function (error) {
        log.error("Unable to find match for " + movieName + " : " + error);
    }))
};
Indexer.prototype.enqueueMissingImage = function (movieId) {
    throttle.add(function () {
        this.moviedb.fetchMovieImages(movieId, function (movieId, images) {
            this.movieMap.setMovieProperties(movieId, {
                'imageUrl': this.moviedb.findBestPoster(movieId, images)
            });
        });
    });
};
Indexer.prototype.enqueueFetchImages = function (movieId) {
    throttle.add(function () {
        movie = this.movieMap.getMovie(movieId);
        props = {
            fileName: '',
            imagePath: '',
            imageLoc: '',
            baseUrl: ''
        };
        fetch = require('./image-fetch')(props);
        fetch.fetch();
    })
}

module.exports = Indexer;

