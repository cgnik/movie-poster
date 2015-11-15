Indexer = require('./indexer.js');

function Main() {
    this.indexer = new Indexer();
    this.directories = [];
    this.files = [];
};
Main.prototype.initProcessArgs = function (args) {
    args.forEach((function (val, index, array) {
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
                throw new Error("Cannot scan nonexistent dir " + val);
            }
        }
    }).bind(this));
    if (this.directories.length < 1) {
        log.always("No diretory specified.  Defaulting to ./");
        this.directories.push('./');
    }
    this.files.forEach((function (file) {
        this.indexer.movieMap.addMovieFile(file);
    }).bind(this))
    this.files.forEach((function (directory) {
        try {
            this.indexer.movieMap.addMovieDirectory(directory);
        } catch (e) {
            console.log(log);
            log.error("Skipping directory '" + directory + "' : " + e);
        }
    }).bind(this));
};
module.exports = new Main();

// exec
//indexer.configure(process.argv);
//indexer.start(indexer.configureAndSpawnRetrieve);

/* Examples
 * http://api.themoviedb.org/3/movie/348/images/vMNl7mDS57vhbglfth5JV7bAwZp.jpg
 * https://image.tmdb.org/t/p/w396/uU9R1byS3USozpzWJ5oz7YAkXyk.jpg
 */
