moviedb = module.require("moviedb");
Fetcher = require('./image-fetch.js');

class MovieDbMovieDb {
    constructor(params) {
        // we require the key for api access to be in this file
        if (params.themoviedbKey == undefined && params.moviedb == undefined) {
            throw new Error("Unable to proceed.  The MovieDB API cannot be used without a valid key.")
        }
        merge(this, params);
        if (this.moviedb == undefined) {
            log.info("Initializing moviedb");
            this.moviedb = require('moviedb')(this.themoviedbKey);
        }
        if (this.moviedb === undefined) {
            throw new Error("Unable to load moviedb");
        }
        this.configuration = {};
    }

    configure(callback) {
        this.moviedb.configuration('', (function (err, config) {
            if (err) {
                log.error(err);
            } else {
                log.always("Configured; Requesting images");
                this.configuration = config;
                callback();
            }
        }).bind(this));
    }

    searchMovies(movieName, callback, failback) {
        if (movieName == undefined || movieName == null || callback == undefined || callback == null) {
            throw new Error("Cannot search movies with null name or null callback");
        }
        this.moviedb.searchMovie({
            query: '"' + movieName + '"'
        }, function (error, searchResults) {
            if (error && failback) {
                failback(movieName, error);
            } else {
                callback(movieName, searchResults.results);
            }
        });
    }

    fetchMovieImages(movieId, callback) {
        this.moviedb.movieImages({
            id: movieId
        }, function (error, results) {
            if (error == null || (error.status >= 200 && error.status < 300)) {
                callback(movieId, results.posters);
            } else {
                log.error("Could not fetch image for movie Id '" + movieId + "'");
                log.error(error);
            }
        });
    }

    fetchMovieImage(movie) {
        props = {
            fileName: movie.name,
            imagePath: movie.directory,
            imageLoc: movie.imageUrl,
            baseUrl: this.configuration.images.base_url
        };
        fetch = new Fetcher(props);
        fetch.fetch();
    }

    findBestTitleMatch(title, titleList) {
        if (title === undefined || title == null || titleList == undefined || titleList == null) {
            throw Error("Cannot match movie name or list which is null.");
        }
        var reduced = titleList
            .map(function (n) {
                return n.title || '';
            });
        log.debug("fuzzy-searching title: " + title + "; reduced: " + reduced);
        let fuzzymatches = fuzzy.filter(title, reduced);
        let bestmatch = _.max(fuzzymatches, function (fuzzymatch) {
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
            log.info("Chose id " + titleList[bestmatch.index].id + " for " + title);
        } else {
            log.error("NO MATCH for title " + title);
        }
        return id;
    }

    // res.posters from moviedb poster search
    findBestPoster(movieId, movieImageList) {
        // validate
        if (movieId == null || movieId == undefined ||
            movieImageList == null || movieImageList == null) {
            throw new Error("Couldn't retrieve '" + movieId);
        } else if (movieImageList.length < 1) {
            return undefined;
        }
        // default
        let image = movieImageList[0];
        // find first english
        let englishImages = _.filter(movieImageList, function (poster) {
            return poster.iso_639_1 != null
                && poster.iso_639_1.toLowerCase() == 'en';
        });
        if (englishImages && englishImages.length > 0) {
            image = englishImages[0];
        }
        // give up if nothing's worked
        if (image == null) {
            log.error("ERROR FINDING ENGLISH POSTER: " + movieId);
            log.info(movieImageList);
            return;
        }
        return image.file_path;
    }
}

module.exports = MovieDbMovieDb;
