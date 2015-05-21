// modules
var fs = module.require("fs");
var moviedir = module.require('./movie-dir.js');
var moviematcher = module.require('./movie-matcher.js');
var log = module.require('./movie-log.js');
var rateLimit = require("rate-limit");
var request = module.require('request');
var _ = module.require('underscore');
// we require the key for api access to be in this file
themoviedbKey = fs.readFileSync('themoviedb-key.txt');
if (themoviedbKey == null) {
	process.exit(1);
}
var moviedb = module.require("moviedb")(themoviedbKey);

// decl
var queue = rateLimit.createQueue({
	interval : 500
});
// setup
var debug = false;
process.argv.forEach(function(val, index, array) {
	if (val == '--debug') {
		log.loglevel = 'debug';
	} else if (val == '--error') {
		log.loglevel = 'error';
	} else if (val == '--info') {
		log.loglevel = 'info';
	}
});
// where we're putting the images
// var imagePath = "/Volumes/movies/";
var imagePath = "/Users/christo/Desktop/test/";
var configuration = [];
// note -- if the movie name is already in here, we don't re-search it
var moviesNames = {
	"aliens" : 679,
	"alice in wonderland" : 12092,
	"adaptation" : 2757,
	"angela" : 32622,
	"atonement" : 4347,
	"batman" : 268,
	"bridesmaids" : 55721,
	"bringing down the house" : 10678
};
var movies = [];
// handles movie fetch from movie id
var movieImageFetch = function(id) {
	return function(err, res) {
		if (err || res == null || res.posters == null || res.posters.length < 1) {
			log.error("Unable to retrieve '" + movies[id] + ": " + err);
		}
		var image = res.posters[0];

		image = _.filter(res.posters, function(poster) {
			return poster.iso_639_1 != null
					&& poster.iso_639_1.toLowerCase() == 'en';
		})[0];
		if (image == null) {
			image = res.posters[0];
		}
		if (image == null) {
			log.error("ERROR FINDING ENGLISH POSTER: " + movies[id] + " (" + id
					+ "): ");
			log.info(res);
			return;
		}
		var url = configuration.base_url + "w300" + image.file_path;
		var dotLoc = image.file_path.lastIndexOf('.');
		var ext = image.file_path.substr(dotLoc, image.file_path.length
				- dotLoc);
		var fileName = movies[id] + ext;
		var fileDestination = imagePath + fileName;
		log.info("Writing out file " + fileDestination + " for movie "
				+ movies[id]);
		request.get(url).on('error', function(err) {
			log.error(err)
		}).pipe(fs.createWriteStream(fileDestination));
	}
};

var queueMovieName = function(movieName) {
	return function() {
		log.debug("Enqueueing name " + movieName);
		moviedb.searchMovie({
			query : '"' + movieName + '"'
		}, movieIdentification(movieName));
	}
};
var queueMovieId = function(id) {
	return function() {
		moviedb.movieImages({
			id : id
		}, movieImageFetch(id));
	}
};
// parses results from movies and finds exact title match
var movieIdentification = function(name) {
	return function(err, res) {
		if (err) {
			log.error("ERROR: " + err);
			return;
		}
		var fuzzymatches = fuzzy.filter(name, res.results.map(function(result) {
			return result.title;
		}));
		var bestmatch = _.max(fuzzymatches, function(fuzzymatch) {
			return fuzzymatch.score;
		});
		// failsafe -- if no best and only one result, trust the moviedb
		if (_.isEmpty(bestmatch) && res.results.length == 1) {
			bestmatch = {
				index : 0
			};
		}
		log.info("best match '" + name + "'");
		log.debug(bestmatch);
		if (!_.isEmpty(bestmatch)) {
			var id = res.results[bestmatch.index].id;
			log.info("Chose id " + res.results[bestmatch.index].id + " for "
					+ name);
			log.debug(res.results[bestmatch.index]);
			movies[id] = name;
			queue.add(queueMovieId(id));
		} else {
			log.error("NO MATCH for title " + name);
			log.debug(res.results);
			log.debug("fuzzymatches");
			log.debug(fuzzymatches);
		}
	};
};
// reads the directory and spawns requests for the first image of each found
// result
var spawnMovieImageRetrievals = function() {
	// gets movie results for each file in movie dir
	var movieImageMap = moviedir.MovieImageMap(imagePath).getMovieImageMap();
	_.keys(movieImageMap).filter(function(key) {
		return movieImageMap[key] == null;
	}).forEach(function(movieName) {
		if (moviesNames[movieName] != null) {
			queue.add(queueMovieId(moviesNames[movieName]));
		} else {
			queue.add(queueMovieName(movieName));
		}
	});
}

moviedb
		.configuration(
				'',
				function(err, config) {
					if (err) {
						log.error(err);
					} else {
						log
								.error("Retrieved configuration.  Proceeding to spawn requests for movies/images");
						configuration = config.images;
						spawnMovieImageRetrievals();
					}
				});
/*
 * http://api.themoviedb.org/3/movie/348/images/vMNl7mDS57vhbglfth5JV7bAwZp.jpg
 * https://image.tmdb.org/t/p/w396/uU9R1byS3USozpzWJ5oz7YAkXyk.jpg
 */
