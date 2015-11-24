Indexer = require('./indexer.js');
MovieMap = require('./movie-map.js');

function Main() {
    this.directories = [];
    this.files = [];
    this.movieMap = new MovieMap();
    this.indexer = new Indexer(this.movieMap);
};

Main.prototype.initProcessArgs = function (args) {
    arguments = args.slice(2);
    arguments.forEach((function (val, index, array) {
        if (val.indexOf("--") == 0) {
            whole = val.substr(2);
            name = whole.substr(0, whole.indexOf('='));
            value = whole.substr(whole.indexOf('=') + 1);
            if (name && value) {
                this[name] = value;
            }
        } else if (!(val.indexOf('--') >= 0)) {
            stats = fs.statSync(val);
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
    this.files.forEach((function (file) {
        this.movieMap.addMovieFile(file);
    }).bind(this));
    this.directories.forEach((function (directory) {
        try {
            this.movieMap.initialize(directory);
        } catch (e) {
            log.error("Skipping directory '" + directory + "'");
        }
    }).bind(this));
};

Main.prototype.process = function () {
    this.indexer.initialize(this, this.finish.bind(this));
};
Main.prototype.finish = function () {
    this.movieMap.persist();
}

module.exports = Main;

/* Examples
 * http://api.themoviedb.org/3/movie/348/images/vMNl7mDS57vhbglfth5JV7bAwZp.jpg
 * https://image.tmdb.org/t/p/w396/uU9R1byS3USozpzWJ5oz7YAkXyk.jpg
 */
