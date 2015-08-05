// dependencies
fuzzy = module.require('fuzzy');
rateLimit = require("rate-limit");
_ = module.require('underscore');
fs = module.require("fs");

var MovieDbQueue = (function (params) {
    // we require the key for api access to be in this file
    if (params.themoviedbKey == null) {
        process.exit(1);
    }
    // speed at which we process the queue in ms
    var rateInterval = params.rateInterval ? params.rateInterval : 500;
    // interface to themoviedb
    moviedb = module.require("moviedb")(params.themoviedbKey);
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
            self.log = global['log'];
            self.queue = self.rateLimit.createQueue({
                interval: rateInterval
            });
        },
        queueMovieName: function (movieName) {
            self.queue.add(function () {
                self.log.debug("Enqueueing name " + movieName);
                moviedb.searchMovie({
                    query: '"' + movieName + '"'
                }, self.findMovieId(movieName));
            });
        },
        queueMovieId: function (id, name) {
            self.queue.add(function () {
                self.log.debug("Enqueueing id " + id);
                self.movies[id] = name;
                moviedb.movieImages({
                    id: id
                }, self.findMovieImage(id, self.addMovieImage));
            });
        },
        addMovieImage: function (id, imagePath) {
            self.movieImages[id] = imagePath;
        },
        // handles movie fetch from movie id
        findMovieImage: function (id, callback) {
            return function (err, res) {
                // validate
                if (err || res == null || res.posters == null
                    || res.posters.length < 1) {
                    self.log.error("Couldn't retrieve '" + self.movies[id]
                        + "': " + err);
                    return;
                }
                // default
                image = res.posters[0];
                // find first english
                englishImages = self._.filter(res.posters, function (poster) {
                    return poster.iso_639_1 != null
                        && poster.iso_639_1.toLowerCase() == 'en';
                });
                if (englishImages) {
                    image = englishImages[0];
                }
                // give up if nothing's worked
                if (image == null) {
                    self.log.error("ERROR FINDING ENGLISH POSTER: "
                        + movies[id] + " (" + id + "): ");
                    self.log.info(res);
                    return;
                }
                callback(id, image.file_path);
            }
        },

        // parses results from movies and finds exact title match
        findMovieId: function (name) {
            return function (err, res) {
                if (err) {
                    self.log.error("ERROR: " + err);
                    return;
                }
                fuzzymatches = fuzzy.filter(name, res.results
                    .map(function (result) {
                        return result.title;
                    }));
                bestmatch = self._.max(fuzzymatches, function (fuzzymatch) {
                    return fuzzymatch.score;
                });
                // failsafe -- if no best and only one result, trust the moviedb
                if (self._.isEmpty(bestmatch) && res.results.length == 1) {
                    bestmatch = {
                        index: 0
                    };
                }
                self.log.info("best match '" + name + "'");
                self.log.debug(bestmatch);
                if (!self._.isEmpty(bestmatch)) {
                    id = res.results[bestmatch.index].id;
                    self.log.info("Chose id " + res.results[bestmatch.index].id
                        + " for " + name);
                    self.log.debug(res.results[bestmatch.index]);
                    self.movies[id] = name;
                    self.queueMovieId(id, name);
                } else {
                    self.log.error("NO MATCH for title " + name);
                    self.log.debug(res.results);
                    self.log.debug("fuzzymatches");
                    self.log.debug(fuzzymatches);
                }
            };
            return self;
        }
    });
});
module.exports = MovieDbQueue;
