// log -- needed pervasively
global['log'] = module.require('./movie-log.js');
log = global['log'];
log.always("Logging configured with level " + log.level);

// modules
var moviedir = module.require('./movie-dir.js');
var queue = module.require('./moviedb-queue.js');
var _ = module.require('underscore');

// configuration
var retrieve = {
	imagePath : [],
	// note -- if the movie name is already in here, we don't re-search it
	moviesNames : {},
	configure : function() {
		// initialize static named movies
		if (fs.existsSync('./movie-ids.json')) {
			retrieve.moviesNames = JSON.parse(fs.readFileSync(
					'./movie-ids.json', 'utf8'));
			log.always("Using static movie IDs ");
			log.debug(retrieve.moviesNames);
		}
		process.argv.forEach(function(val, index, array) {
			if (val.indexOf("--") == 0) {
				return;
			} else if (!(val.indexOf('--') >= 0)) {
				stats = fs.statSync(val);
				if (stats.isDirectory()) {
					log.always("Adding scan dir " + val);
					moviePath = val;
					if (moviePath.charAt(moviePath.length - 1) != '/') {
						moviePath = moviePath + '/';
					}
					retrieve.imagePath.push(moviePath);
				}
			}
		});
		if (this.imagePath.length < 1) {
			log.always("No diretory specified.  Defaulting to ./");
			retrieve.imagePath.push("./");
		}
		// where we're putting the images
		queue.configuration = {};
		queue.imagePath = retrieve.imagePath;
	},
	// Finds missing posters in moviedir and enqueues fetches
	spawnMovieImageRetrievals : function(nameSerch, idSearch) {
		retrieve.imagePath
				.forEach(function(path) {
					// gets movie results for each file in movie dir
					var movieImageMap = moviedir.MovieImageMap(path)
							.getMovieImageMap();
					log.debug(movieImageMap);
					_.keys(movieImageMap).filter(function(key) {
						return movieImageMap[key] == null;
					}).forEach(retrieve.enqueueMissing);
				});
	},
	enqueueMissing : function checkOrEnqueueFetch(movieName) {
		movieId = retrieve.moviesNames[movieName.toLowerCase()];
		if (movieId != null) {
			log.always("Enqueueing image fetch: " + movieName + " : movie id "
					+ movieId);
			queue.queueMovieId(movieId, movieName);
		} else {
			log.always("Enqueueing search: " + movieName);
			queue.queueMovieName(movieName);
		}
	},
	start : function(callback) {
		moviedb.configuration('', function(err, config) {
			if (err) {
				log.error(err);
			} else {
				log.error("Configured; Requesting images");
				queue.configuration = config.images;
				callback();
			}
		});
	}
};

// exec
retrieve.configure();
retrieve.start(retrieve.spawnMovieImageRetrievals)

/*
 * http://api.themoviedb.org/3/movie/348/images/vMNl7mDS57vhbglfth5JV7bAwZp.jpg
 * https://image.tmdb.org/t/p/w396/uU9R1byS3USozpzWJ5oz7YAkXyk.jpg
 */
