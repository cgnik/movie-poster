// dependencies
require('./util.js');
fuzzy = module.require('fuzzy');
rateLimit = require("rate-limit");
_ = module.require('underscore');
fs = module.require("fs");

var MovieDbQueue = (function (params) {
    // we require the key for api access to be in this file
    if (params.themoviedbKey == undefined && params.moviedb == undefined) {
        throw new Exception("Unable to proceed.  The MovieDB API cannot be used without a valid key.")
    }
    // speed at which we process the queue in ms
    var rateInterval = params.rateInterval ? params.rateInterval : 500;
    // interface to themoviedb
    var self = ({
        queue: null,
        log: null,
        movies: {},
        movieImages: {},
        configuration: {
            base_url: '/'
        },
        imagePath: './',
        init: function () {
            log = global['log'];
            self.queue = self.rateLimit.createQueue({
                interval: rateInterval
            });
        },
        addMovieImage: function (id, imagePath) {
            movieImages[id] = imagePath;
        },
        queueMovieName: function (movieName, callback) {
            // queueMovieName(name, self.findMovieId)
            self.queue.add(function () {
                log.debug("Enqueueing name " + movieName);
                moviedb.searchMovie({
                    query: '"' + movieName + '"'
                }, callback(movieName));
            });
        },
        queueMovieId: function (id, name, callback) {
            // queueMovieId(id,name,self.findMovieImage)
            self.queue.add(function () {
                log.debug("Enqueueing id " + id);
                self.movies[id] = name;
                moviedb.movieImages({
                    id: id
                }, callback(id, name));
            });
        },
        // handles movie fetch from movie id
        // findMovieImage(id, self.addMovieImage)
        findMovieImage: function (id, callback) {
            return function (err, res) {
                // call matchMovieImage
            }
        },
        // res.posters from moviedb poster search
        matchMovieImage: function (movieId, movieName, movieImageList) {
            // validate
            if (movieId == null || movieId == undefined || movieName == null || movieName == undefined ||
                movieImageList == null || movieImageList == null) {
                throw new Error("Couldn't retrieve '" + movieId);
            } else if (movieImageList.length < 1) {
                return null;
            }
            // default
            image = movieImageList[0];
            // find first english
            englishImages = _.filter(movieImageList, function (poster) {
                return poster.iso_639_1 != null
                    && poster.iso_639_1.toLowerCase() == 'en';
            });
            if (englishImages && englishImages.length > 0) {
                image = englishImages[0];
            }
            // give up if nothing's worked
            if (image == null) {
                log.error("ERROR FINDING ENGLISH POSTER: " + movieName);
                log.info(movieImageList);
                return;
            }
            return image.file_path;
        },
        matchMovieName: function (name, nameList) {
            if (name === undefined || name == null || nameList == undefined || nameList == null) {
                throw Error("Cannot match movie name or list which is null.");
            }
            var reduced = nameList
                .map(function (n) {
                    return n.title;
                });
            fuzzymatches = fuzzy.filter(name, reduced);
            bestmatch = _.max(fuzzymatches, function (fuzzymatch) {
                return fuzzymatch.score;
            });
            // failsafe -- if no best and only one result, trust the moviedb
            if (_.isEmpty(bestmatch) && nameList.length == 1) {
                bestmatch = {
                    index: 0
                };
            }
            // log and respond
            var id = null;
            if (!_.isEmpty(bestmatch)) {
                id = nameList[bestmatch.index].id;
                log.info("Chose id " + nameList[bestmatch.index].id
                    + " for " + name);
            } else {
                log.error("NO MATCH for title " + name);
            }
            return id;
        },
        configure: function (callback) {
            self.moviedb.configuration('', function (err, config) {
                if (err) {
                    log.error(err);
                } else {
                    log.always("Configured; Requesting images");
                    callback(config);
                }
            });
        }
    });
    merge(self, params);
    if (self.moviedb == undefined) {
        log.info("Initializing moviedb");
        self.moviedb = require('moviedb')(self.themoviedbKey);
    }
    if (self.queue == undefined) {
        log.info("Initializing rate limit queue");
        self.queue = rateLimit.createQueue({
            interval: rateInterval
        });
    }
    return self;
});
module.exports = MovieDbQueue;
