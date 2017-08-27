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
                self.indexers[directory].process();
            } catch (e) {
                log.error("Skipping directory '" + directory + "': " + e);
            }
        }).bind(this));
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
