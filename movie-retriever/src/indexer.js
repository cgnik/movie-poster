// modules
require('./globals.js');
queue = module.require('./moviedb-moviedb.js');
moviedb = module.require("moviedb");
moviemap = module.require('./movie-map.js');
throttle = module.require('./throttle.js');

var _ = module.require('underscore');
var count = 1;
// configuration
var Indexer = (function () {
    self = {
        // note -- if the movie name is already in here, we don't re-search it
        movieIds: {},
        movieMap: moviemap,
        throttle: throttle,
        initialize: function (params) {
            merge(self, params);
            self.initMoviedb();
            self.initMovieIds();
        },
        clear: function () {
            self.movieIds = {};
            self.movieMap.clear();
        },
        initMoviedb: function () {
            if (this.themoviedbKey == undefined) {
                this.themoviedbKey = fs.readFileSync('themoviedb-key.txt');
            }
            this.moviedb = queue({'themoviedbKey': this.themoviedbKey});
        },
        initMovieIds: function () {
            // initialize static named movies
            if (fs.existsSync('movie-ids.json')) {
                this.movieIds = JSON.parse(fs.readFileSync(
                    'movie-ids.json', 'utf8'));
                log.always("Using static movie IDs ");
                log.debug(this.movieIds);
            }
        },
        initProcessArgs: function (args) {
            args.forEach(function (val, index, array) {
                if (val.indexOf("--") == 0) {
                    whole = val.substr(2);
                    name = whole.substr(0, whole.indexOf('='));
                    value = whole.substr(whole.indexOf('=') + 1);
                    if (name && value) {
                        self[name] = value;
                    }
                } else if (!(val.indexOf('--') >= 0)) {
                    stats = fs.statSync(val);
                    if (stats && stats.isDirectory()) {
                        log.always("Adding movie dir " + val);
                        self.movieMap.addMovieDirectory(val);
                    } else if (stats.isFile()) {
                        log.always("Adding movie file " + val);
                        self.movieMap.addMovieFile(val);
                    } else {
                        throw new Error("Cannot scan nonexistent dir " + val);
                    }
                }
            });
            if (self.movieMap.movieDirectories.length < 1) {
                log.always("No diretory specified.  Defaulting to ./");
                self.movieMap.addMovieDirectory('./');
            }
        },
        // Overlays the movieIds to the movieMap
        applyMovieIdsToMap: function () {
            _.keys(self.movieIds).forEach(function (movieKey) {
                if (self.movieMap.movieMap[movieKey]) {
                    self.movieMap.movieMap[movieKey].id = self.movieIds[movieKey];
                }
            })
        },
        // Finds missing ids in moviemap and enqueues fetches
        findMissingMovieIds: function () {
            return self.movieMap.toList().filter(function (movie) {
                return movie.id == undefined;
            })
        },
        // Finds missing posters in moviemap and enqueues fetches
        findMissingMovieImages: function () {
            return self.movieMap.toList().filter(function (movie) {
                return movie.image == undefined;
            })
        },
        enqueueMissingIds: function () {
            self.applyMovieIdsToMap();
            self.findMissingMovieIds().forEach(function (movie) {
                self.enqueueMissingId(movie.name);
            });
        },
        enqueueMissingId: function (movieName) {
            throttle.add(self.moviedb.searchMovies(movieName, function (movieName, results) {
                bestMatch = self.moviedb.findBestTitleMatch(movieName, results);
                if (bestMatch) {
                    self.movieMap.movieMap[movieName].id = bestMatch.id;
                } else {
                    self.movieMap.movieMap[movieName].error = "Not Found";
                    self.movieMap.movieMap[movieName].results = results;
                }
            }, function (error) {
                log.error("Unable to find match for " + movieName + " : " + error);
            }))
        },
        enqueueMissingImage: function (movieId) {
            throttle.add(self.moviedb.searchMovies(movieName, function (movieName, results) {
                bestMatch = self.moviedb.findBestTitleMatch(movieName, results);
                if (bestMatch) {
                    self.movieMap.movieMap[movieName].id = bestMatch.id;
                } else {
                    self.movieMap.movieMap[movieName].error = "Not Found";
                    self.movieMap.movieMap[movieName].results = results;
                }
            }, function (error) {
                log.error("Unable to find match for " + movieName + " : " + error);
            }))
        }

    }
    return self;
});
module.exports = Indexer;

