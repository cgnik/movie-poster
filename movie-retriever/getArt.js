fs = module.require("fs");
// we require the key for api access to be in this file
themoviedbKey = fs.readFileSync('themoviedb-key.txt');
if (themoviedbKey == null) {
	process.exit(1);
}

moviedb = module.require("moviedb")(themoviedbKey);
rateLimit = require("rate-limit");
sleep = module.require('sleep');
request = module.require('request');

// where we're putting the images
// var imagePath = "/Users/christo/dev/w.nodejs/movie-retriever/images/";
var imagePath = "/Volumes/movies/";
// the repo of keys we're retrieving
var configuration = [];
// note -- if the movie name is already in here, we don't re-search it
var moviesNames = {
	"ALIENS" : 679,
	"ALICE IN WONDERLAND" : 12092,
	"ADAPTATION" : 2757,
	"ANGELA" : 32622,
	"ATONEMENT" : 4347,
	"BRIDESMAIDS" : 55721,
	"BRINGING DOWN THE HOUSE" : 10678
};
var movies = new Array();
// handles movie fetch from movie id
var movieImageFetch = function(id) {
	return function(err, res) {
		if (err || res == null || res.posters == null || res.posters.length < 1) {
			console.log("Unable to retrieve '" + movies[id] + ": " + err);
		}
		var image = res.posters[0];
		for (i = 0; i < res.posters.length; i++) {
			if (res.posters[i].iso_639_1 != null
					&& res.posters[i].iso_639_1.toLowerCase() == 'en') {
				image = res.posters[i];
				break;
			}
		}
		if (image == null) {
			console.log("ERROR: " + movies[id] + " (" + id + "): ");
			console.log(res);
			return;
		}
		var url = configuration.base_url + "w300" + image.file_path;
		var dotLoc = image.file_path.lastIndexOf('.');
		var ext = image.file_path.substr(dotLoc, image.file_path.length
				- dotLoc);
		var fileName = movies[id] + ext;
		var fileDestination = imagePath + fileName;
		fs.exists(fileDestination, function(exists) {
			if (!exists) {
				request.get(url).on('error', function(err) {
					console.log(err)
				}).pipe(fs.createWriteStream(fileDestination));
			} else {
				// console.log("skipping present file : " + fileDestination);
			}
		});
	}
};
var targetMovieImage = function(targetFile, movieName) {
	return function(exists) {
		if (!exists) {
			// we go get the id
			queue.add(queueMovieName(movieName));
		} else {
			// console.log("Skipping already existing file " + targetFile);
		}
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
		// console.log("Enqueueing id " + id);
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
		var skip = 0;
		for (j = 0; j < res.results.length; j++) {
			var id = res.results[j].id;
			if (res.results[j].title.toUpperCase() === name.toUpperCase()) {
				movies[id] = res.results[j].title;
				console.log("Fetching image for movie '" + movies[id]
						+ "' (id: " + id + ")");
				queue.add(queueMovieId(id));
			}
			if (movies[id] != null) {
				break;
			}
		}
	};
};
// reads the directory and spawns requests for the first image of each found
// result
var spawnMovieRetrievals = function() {
	// gets movie results for each file in movie dir
	fs.readdir("/Volumes/movies/", function(err, files) {
		for (i = 0; i < files.length; i++) {
			fileName = files[i];
			movieName = fileName.substring(0, fileName.lastIndexOf('.'));
			// null protection
			if (movieName.length < 1) {
				continue;
			}
			// figure out the target file name/path
			var target = imagePath + movieName + ".jpg";
			// if we've already got this in the queue
			if (movieName.toUpperCase() in moviesNames) {
				movieNameU = movieName.toUpperCase();
				console.log("Using predefined movie id: " + movieName + " ("
						+ moviesNames[movieNameU] + ")");
				// just spawn the retrieval, already
				var id = moviesNames[movieNameU];
				movies[id] = movieName;
				queue.add(queueMovieId(id));
			} else {
				// else go get it if we don't already have it
				fs.exists(target, targetMovieImage(target, movieName));
			}
			// get out if we're done + safety until get it right
			if (movieName in movies) {
				break;
			}
		}
	});
}

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
						spawnMovieRetrievals();
					}
				});
/*
 * http://api.themoviedb.org/3/movie/348/images/vMNl7mDS57vhbglfth5JV7bAwZp.jpg
 * 1c1e657d2d223b479b991d5376dcf4e1
 * 
 * https://image.tmdb.org/t/p/w396/uU9R1byS3USozpzWJ5oz7YAkXyk.jpg
 */
