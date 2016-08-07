// modules

let Indexer = require('./indexer.js');
let MovieSource = require('./moviedb-moviedb.js');

class Main {
    constructor() {
        this.directories = [];
        this.indexers = {};
        this.moviedb = null;
    }

    process() {
        var self = this;
        this.initMoviedb();
        this.directories.forEach((function (directory) {
            self.indexers[directory] = new Indexer(self.moviedb, directory);
            try {
                log.info("Indexing directory " + directory);
                self.indexers[directory].initialize();
            } catch (e) {
                log.error("Skipping directory '" + directory + "': " + e);
            }
        }).bind(this));
    }

    initProcessArgs(args) {
        var params = (args || []).slice(2);
        params.forEach((function (val, index, array) {
            if (val.indexOf("--") == 0) {
                var whole = val.substr(2);
                var name = whole.substr(0, whole.indexOf('='));
                var value = whole.substr(whole.indexOf('=') + 1);
                if (name && value) {
                    this[name] = value;
                }
            } else if (!(val.indexOf('--') >= 0)) {
                var stats = fs.statSync(val);
                if (stats && stats.isDirectory()) {
                    log.always("Adding movie dir " + val);
                    this.directories.push(val);
                } else if (stats.isFile()) {
                    log.always("Adding movie file " + val);
                    this.files.push(val);
                } else {
                    msg = "Cannot scan nonexistent dir " + val;
                    log.error(msg)
                    throw new Error(msg);
                }
            }
        }).bind(this));
        if (this.directories.length < 1) {
            log.always("No diretory specified.  Defaulting to ./");
            this.directories.push('./');
        }
    }

    initMoviedb() {
        if (this.themoviedbKey == undefined) {
            this.themoviedbKey = fs.readFileSync('themoviedb-key.txt');
        }
        this.moviedb = new MovieSource({'themoviedbKey': this.themoviedbKey});
        if (this.moviedb === undefined) {
            throw new Error("Unable to initialize moviedb searching");
        }
    }
}

module.exports = Main;
/* Examples
 * http://api.themoviedb.org/3/movie/348/images/vMNl7mDS57vhbglfth5JV7bAwZp.jpg
 * https://image.tmdb.org/t/p/w396/uU9R1byS3USozpzWJ5oz7YAkXyk.jpg
 */
