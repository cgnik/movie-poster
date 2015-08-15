// dependencies
require('./util.js');
fuzzy = module.require('fuzzy');
_ = module.require('underscore');

var MovieDbQueue = (function (params) {
    // we require the key for api access to be in this file
    if (params.themoviedbKey == undefined && params.moviedb == undefined) {
        throw new Exception("Unable to proceed.  The MovieDB API cannot be used without a valid key.")
    }
    // interface to themoviedb
    var self = ({
        configure: function (callback) {
            self.moviedb.configuration('', function (err, config) {
                if (err) {
                    log.error(err);
                } else {
                    log.always("Configured; Requesting images");
                    self.configuration = config;
                    callback(config);
                }
            });
        },
        searchMovies: function (movieName, callback, failback) {
            if (movieName == undefined || movieName == null || callback == undefined || callback == null) {
                throw new Error("Cannot search movies with null name or null callback");
            }
            self.moviedb.searchMovie({
                query: '"' + movieName + '"'
            }, function (error, searchResults) {
                if (error && failback) {
                    failback(movieName, error);
                } else {
                    callback(movieName, searchResults.results);
                }
            });
        },
        findBestTitleMatch: function (title, titleList) {
            if (title === undefined || title == null || titleList == undefined || titleList == null) {
                throw Error("Cannot match movie name or list which is null.");
            }
            var reduced = titleList
                .map(function (n) {
                    return n.title;
                });
            fuzzymatches = fuzzy.filter(title, reduced);
            bestmatch = _.max(fuzzymatches, function (fuzzymatch) {
                return fuzzymatch.score;
            });
            // failsafe -- if no best and only one result, trust the moviedb
            if (_.isEmpty(bestmatch) && titleList.length == 1) {
                bestmatch = {
                    index: 0
                };
            }
            // log and respond
            var id = null;
            if (!_.isEmpty(bestmatch)) {
                id = titleList[bestmatch.index].id;
                log.info("Chose id " + titleList[bestmatch.index].id
                    + " for " + title);
            } else {
                log.error("NO MATCH for title " + title);
            }
            return id;
        },
        // res.posters from moviedb poster search
        findBestPoster: function (movieId, movieImageList) {
            // validate
            if (movieId == null || movieId == undefined ||
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
                log.error("ERROR FINDING ENGLISH POSTER: " + mmovieId);
                log.info(movieImageList);
                return;
            }
            return image.file_path;
        },
    });
    merge(self, params);
    if (self.moviedb == undefined) {
        log.info("Initializing moviedb");
        self.moviedb = require('moviedb')(self.themoviedbKey);
    }
    return self;
});
module.exports = MovieDbQueue;
