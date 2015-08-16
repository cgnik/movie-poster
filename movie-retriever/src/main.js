// modules
require('./util.js');
queue = module.require('./moviedb-moviedb.js');
moviedb = module.require("moviedb");

var moviedir = module.require('./movie-dir.js');
var _ = module.require('underscore');
var count = 1;
// configuration
var MainRetriever = (function () {
    self = {
        imagePath: [],
        // note -- if the movie name is already in here, we don't re-search it
        movieIds: {},
        init: function (params) {
            merge(MainRetriever, params);
            initMovieDb();
            initMovieIds();
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
        configure: function (props) {

            props.forEach(function (val, index, array) {
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
                        log.always("Adding scan dir " + val);
                        moviePath = val;
                        if (moviePath.charAt(moviePath.length - 1) != '/') {
                            moviePath = moviePath + '/';
                        }
                        self.imagePath.push(moviePath);
                    } else {
                        throw new Error("Cannot scan nonexistent dir " + val);
                    }// else if(stats.isFile() -- it's a movie file to be retrieved
                }
            });
            if (self.imagePath.length < 1) {
                log.always("No diretory specified.  Defaulting to ./");
                self.imagePath.push("./");
            }
        },
        // Finds missing posters in moviedir and enqueues fetches
        spawnMovieImageRetrievals: function (nameSerch, idSearch) {
            retrieve.imagePath
                .forEach(function (path) {
                    // gets movie results for each file in movie dir
                    var movieImageMap = moviedir.MovieImageMap(path)
                        .getMovieImageMap();
                    log.debug(movieImageMap);
                    _.keys(movieImageMap).filter(function (key) {
                        return movieImageMap[key] == null;
                    }).forEach(retrieve.enqueueMissing);
                });
        },
        enqueueMissing: function (movieName) {
            movieId = retrieve.movieIds[movieName.toLowerCase()];
            if (movieId != null) {
                log.info("Enqueueing image fetch: " + movieName + " : movie id "
                    + movieId);
                queue.queueMovieId(movieId, movieName);
            } else {
                log.info("Enqueueing search: " + movieName);
                queue.queueMovieName(movieName);
            }
        },
        start: function (callback) {
            queue.configure(callback);
        },
        configureAndSpawnRetrieve: function (configuration) {
            queue.configuration = config.images;
        },
    }
    return self;
});
module.exports = MainRetriever;

// exec
//MainRetriever.configure(process.argv);
//MainRetriever.start(MainRetriever.configureAndSpawnRetrieve)

/*
 * http://api.themoviedb.org/3/movie/348/images/vMNl7mDS57vhbglfth5JV7bAwZp.jpg
 * https://image.tmdb.org/t/p/w396/uU9R1byS3USozpzWJ5oz7YAkXyk.jpg
 */
