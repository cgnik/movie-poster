var log = global['log'];
var fuzzy = module.require('fuzzy');
var rateLimit = require("rate-limit");
var fs = module.require("fs");
var _ = module.require('underscore');
var request = module.require('request');

// we require the key for api access to be in this file
themoviedbKey = fs.readFileSync('themoviedb-key.txt');
if (themoviedbKey == null) {
	process.exit(1);
}
moviedb = module.require("moviedb")(themoviedbKey);
// decl
var queue = rateLimit.createQueue({
	interval : 500
});
var movies = {};

module.exports = {
	configuration : {
		base_url : '/'
	},
	imagePath : '/',

	queueMovieName : function(movieName) {
		queue.add(function() {
			log.debug("Enqueueing name " + movieName);
			moviedb.searchMovie({
				query : '"' + movieName + '"'
			}, movieIdFind(movieName));
		});
	},
	queueMovieId : function(id, name) {
		queue.add(function() {
			log.debug("Enqueueing id " + id);
			movies[id] = name;
			moviedb.movieImages({
				id : id
			}, movieImageFind(id));
		});
	},
	queueMovieImage : function(id, imagePath) {
		queue.add(function() {
			log.debug("Enqueueing image " + id);
			movieImageFetch(id, imagePath);
		});
	},
};
// handles movie fetch from movie id
function movieImageFind(id) {
	return function(err, res) {
		// validate
		if (err || res == null || res.posters == null || res.posters.length < 1) {
			log.error("Unable to retrieve '" + movies[id] + "': " + err);
			return;
		}
		// default
		var image = res.posters[0];
		// find first english
		englishImages = _.filter(res.posters, function(poster) {
			return poster.iso_639_1 != null
					&& poster.iso_639_1.toLowerCase() == 'en';
		});
		if (englishImages) {
			image = englishImages[0];
		}
		// give up if nothing's worked
		if (image == null) {
			log.error("ERROR FINDING ENGLISH POSTER: " + movies[id] + " (" + id
					+ "): ");
			log.info(res);
			return;
		}
		module.exports.queueMovieImage(id, image.file_path);
	}
};
function movieImageFetch(id, imageLoc) {
	var url = module.exports.configuration.base_url + "w300" + imageLoc;
	var dotLoc = imageLoc.lastIndexOf('.');
	var ext = imageLoc.substr(dotLoc, imageLoc.length - dotLoc);
	var fileName = movies[id] + ext;
	var fileDestination = module.exports.imagePath + fileName;
	log
			.info("Writing out file " + fileDestination + " for movie "
					+ movies[id]);
	request.get(url).on('error', function(err) {
		log.error(err)
	}).pipe(fs.createWriteStream(fileDestination));
	log.always("Wrote image '" + fileDestination + "'");
}
// parses results from movies and finds exact title match
function movieIdFind(name) {
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
			module.exports.queueMovieId(id, name);
		} else {
			log.error("NO MATCH for title " + name);
			log.debug(res.results);
			log.debug("fuzzymatches");
			log.debug(fuzzymatches);
		}
	}
};