// modules
var moviedir = module.require('./movie-dir.js');
var moviematcher = module.require('./movie-matcher.js');
global['log'] = module.require('./movie-log.js');
log = global['log'];
log.always("Logging configured with level " + log.level);
var queue = module.require('./moviedb-queue.js');
var _ = module.require('underscore');

// setup

// where we're putting the images
// var imagePath = "/Volumes/movies/";
var imagePath = "/Volumes/movies/";
var configuration = {};
queue.configuration = configuration;
queue.imagePath = imagePath;
// note -- if the movie name is already in here, we don't re-search it
var moviesNames = {};
if (fs.existsSync('movie-ids.json')) {
	moviesNames = fs.readFileSync('movie-ids.json');
}

// reads the directory and spawns requests for the first image of each found
// result
var spawnMovieImageRetrievals = function(nameSerch, idSearch) {
	// gets movie results for each file in movie dir
	var movieImageMap = moviedir.MovieImageMap(imagePath).getMovieImageMap();
	log.debug(movieImageMap);
	needImages = _.keys(movieImageMap).filter(function(key) {
		return movieImageMap[key] == null;
	});
	log.debug("Needing Images: ");
	log.debug(needImages);
	needImages.forEach(function(movieName) {
		if (moviesNames[movieName] != null) {
			queue.queueMovieId(moviesNames[movieName]);
		} else {
			queue.queueMovieName(movieName);
		}
	});
}

function configure(callback) {
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
// exec
configure(spawnMovieImageRetrievals);

/*
 * http://api.themoviedb.org/3/movie/348/images/vMNl7mDS57vhbglfth5JV7bAwZp.jpg
 * https://image.tmdb.org/t/p/w396/uU9R1byS3USozpzWJ5oz7YAkXyk.jpg
 */
