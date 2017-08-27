const MAPFILE = 'movie-map.json';

const MOVIE_EXTENSIONS = [".m4v", ".mkv", ".mp4", ".vob", ".mpg", ".mpeg", ".avi"];
const IMAGE_EXTENSIONS = [".jpg", ".gif", ".png"];

class MovieMap {
    constructor() {
        this.movies = {};
    }

    initialize(directory) {
        this._persistentMapFileName = directory + MAPFILE;
        this.directory = directory;
        this.load();
        this.addMovieFiles(fs.readdirSync(this.directory));
    }

    load() {
        if (fs.existsSync(this._persistentMapFileName)) {
            try {
                let fstat = fs.statSync(this._persistentMapFileName);
                if (fstat && fstat.isFile()) {
                    this.movies = JSON.parse(fs.readFileSync(this._persistentMapFileName));
                } else {
                    console.warning(this.persistentMapFileName + " Exists but is not a file. Unable to load initial map. Continuing.");
                }
            } catch (e) {
                console.error("Unable to initialize existing movie-map.json: could not parse - " + e);
            }
        } else {
            console.info("Pre-existing map file " + this._persistentMapFileName + " not found.");
        }
    }

    persist() {
        if (this.movies !== undefined && Object.keys(this.movies).length > 0) {
            fs.createWriteStream(this._persistentMapFileName).write(JSON.stringify(this.movies)).close();
        } else {
            console.info("Skipping map persist -- nothing to write.");
        }
    }

    toList() {
        return _.map(this.movies, function (k, v) {
            return k;
        });
    }

    clear() {
        this.movies = {};
    }

    addMovieFiles(files) {
        console.debug("Mapping " + files.length + " files");
        files.forEach((function (fileFullName) {
            console.debug("Mapping file " + fileFullName);
            this.addMovieFile(fileFullName);
        }).bind(this));
    }

    addMovieFile(fileFullName) {
        // figure out pieces parts of file name
        let extname = path.extname(fileFullName);
        let mcname = path.basename(fileFullName, extname);
        let name = this.keyify(mcname);
        // get or create mapped name
        let existing = this.movies[name] || {};
        if (existing.name == undefined) {
            existing.name = mcname;
        }
        if (existing.directory == undefined) {
            existing.directory = path.isAbsolute(fileFullName) ? path.dirname(fileFullName) + "/" : this.directory;
        }
        // shuffle in the right props
        if (this.isMovieExtension(extname)) {
            existing.file = fileFullName;
            this.movies[name] = existing;
        } else if (this.isImageFile(extname)) {
            existing.image = fileFullName;
            this.movies[name] = existing;
        } else {
            console.info("Skipping non-image-non-movie file: " + fileFullName);
        }
    }

    getMovie(movieName) {
        return this.movies[this.keyify(movieName)];
    }

    getMovieById(movieId) {
        let movie = null;
        _.keys(this.movies).some((function (key) {
            if (this.movies[key].id === movieId) {
                movie = this.movies[key];
                return true;
            }
        }).bind(this));
        return movie;
    }

    isMovieExtension(fileName) {
        return MOVIE_EXTENSIONS.indexOf(fileName.toLowerCase()) >= 0;
    }

    isImageFile(fileName) {
        return IMAGE_EXTENSIONS.indexOf(fileName.toLowerCase()) >= 0;
    }

    setMovieProperties(movieId, properties) {
        let movie = this.getMovieById(movieId);
        if (movie !== undefined && movie != null) {
            merge(movie, properties);
            return true;
        }
        return false;
    }

    keyify(s) {
        if (s === undefined) {
            return undefined;
        }
        return s.toString().toLowerCase();
    }
}
module.exports = MovieMap;
