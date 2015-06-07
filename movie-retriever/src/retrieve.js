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
	imagePath : "/Volumes/movies/",
	// note -- if the movie name is already in here, we don't re-search it
	moviesNames : {},
	configure : function() {
		// where we're putting the images
		queue.configuration = {};
		queue.imagePath = this.imagePath;
		// initialize static named movies
		if (fs.existsSync('./movie-ids.json')) {
			this.moviesNames = JSON.parse(fs.readFileSync('./movie-ids.json',
					'utf8'));
			log.always("Using static movie IDs ");
			log.debug(this.moviesNames);
		}
	},
	// Finds missing posters in moviedir and enqueues fetches
	spawnMovieImageRetrievals : function(nameSerch, idSearch) {
		// gets movie results for each file in movie dir
		var movieImageMap = moviedir.MovieImageMap(retrieve.imagePath)
				.getMovieImageMap();
		log.debug(movieImageMap);
		_.keys(movieImageMap).filter(function(key) {
			return movieImageMap[key] == null;
		}).forEach(function(movieName) {
			movieId = retrieve.moviesNames[movieName.toLowerCase()];
			if (movieId != null) {
				log.always("Enqueueing image fetch: movie id " + movieId);
				queue.queueMovieId(movieId);
			} else {
				log.always("Enqueueing search: " + movieName);
				queue.queueMovieName(movieName);
			}
		});
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
