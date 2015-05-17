fs = module.require("fs");
// we require the key for api access to be in this file
themoviedbKey = fs.readFileSync('themoviedb-key.txt');
if (themoviedbKey == null) {
	process.exit(1);
}
var moviedir = module.require('./movie-dir.js');
var moviematcher = module.require('./movie-matcher.js');

moviedb = module.require("moviedb")(themoviedbKey);
rateLimit = require("rate-limit");
sleep = module.require('sleep');
request = module.require('request');
_ = module.require('underscore');

// where we're putting the images
// var imagePath = "/Users/christo/dev/w.nodejs/movie-retriever/images/";
var imagePath = "/Volumes/movies/";
// the repo of keys we're retrieving
var configuration = [];
// note -- if the movie name is already in here, we don't re-search it
var moviesNames = {
	"aliens" : 679,
	"alice in wonderland" : 12092,
	"adaptation" : 2757,
	"angela" : 32622,
	"atonement" : 4347,
	"bridesmaids" : 55721,
	"bringing down the house" : 10678
};
var movies = new Array();
// handles movie fetch from movie id
var movieImageFetch = function(id) {
	return function(err, res) {
		if (err || res == null || res.posters == null || res.posters.length < 1) {
			console.log("Unable to retrieve '" + movies[id] + ": " + err);
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
			console.log("ERROR FINDING ENGLISH POSTER: " + movies[id] + " ("
					+ id + "): ");
			console.log(res);
			return;
		}
		var url = configuration.base_url + "w300" + image.file_path;
		var dotLoc = image.file_path.lastIndexOf('.');
		var ext = image.file_path.substr(dotLoc, image.file_path.length
				- dotLoc);
		var fileName = movies[id] + ext;
		var fileDestination = imagePath + fileName;
		console
				.log("Writing out file " + fileName + " for movie "
						+ movies[id]);
		request.get(url).on('error', function(err) {
			console.log(err)
		}).pipe(fs.createWriteStream(fileDestination));
	}
};

var queueMovieName = function(movieName) {
	return function() {
		// console.log("Enqueueing name " + movieName);
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
			console.log("ERROR: " + err);
			return;
		}
		var fuzzymatches = fuzzy.filter(name, res.results.map(function(result) {
			return result.title;
		}));
		var bestmatch = _.max(fuzzymatches, function(fuzzymatch) {
			return fuzzymatch.score;
		});
		// final failsafe -- if we've got no matches and only one result, trust
		// the moviedb search
		if (_.isEmpty(bestmatch) && res.results.length == 1) {
			bestmatch = {
				index : 0
			};
		}
		console.log("best match '" + name + "'");
		console.log(bestmatch);
		if (!_.isEmpty(bestmatch)) {
			var id = res.results[bestmatch.index].id;
			movies[id] = name;
			queue.add(queueMovieId(id));
		} else {
			console.log("NO MATCH for title " + name);
			console.log(res.results);
			console.log("fuzzymatches");
			console.log(fuzzymatches);
		}
	};
};
// reads the directory and spawns requests for the first image of each found
// result
var spawnMovieImageRetrievals = function() {
	// gets movie results for each file in movie dir
	var movieImageMap = moviedir.MovieImageMap("/Volumes/movies/")
			.getMovieImageMap();
	// console.log(movieImageMap);
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
/*
 * movieNameU = movieName.toLowerCase(); console.log("Using predefined movie id: " +
 * movieName + " (" + moviesNames[movieNameU] + ")"); // just spawn the
 * retrieval, already var id = moviesNames[movieNameU]; movies[id] = movieName;
 * queue.add(queueMovieId(id));
 */

var queue = rateLimit.createQueue({
	interval : 500
});

moviedb
		.configuration(
				'',
				function(err, config) {
					if (err) {
						console.log(err);
					} else {
						console
								.log("Retrieved configuration.  Proceeding to spawn requests for movies/images");
						configuration = config.images;
						spawnMovieImageRetrievals();
					}
				});
/*
 * http://api.themoviedb.org/3/movie/348/images/vMNl7mDS57vhbglfth5JV7bAwZp.jpg
 * 1c1e657d2d223b479b991d5376dcf4e1
 * 
 * https://image.tmdb.org/t/p/w396/uU9R1byS3USozpzWJ5oz7YAkXyk.jpg
 */
