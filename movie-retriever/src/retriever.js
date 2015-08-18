// modules
require('./globals.js');
queue = module.require('./moviedb-moviedb.js');
moviedb = module.require("moviedb");
moviemap = module.require('./movie-map.js');

var _ = module.require('underscore');
var count = 1;
// configuration
var Retriever = (function () {
    self = {
        imagePath: [],
        // note -- if the movie name is already in here, we don't re-search it
        movieIds: {},
        movies: {},
        movieMap: moviemap,
        init: function (params) {
            merge(self, params);
            self.initMoviedb();
            self.initMovieIds();
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
    }
    return self;
});
module.exports = Retriever;

