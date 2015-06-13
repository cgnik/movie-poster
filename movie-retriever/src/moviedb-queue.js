// we require the key for api access to be in this file
fs = module.require("fs");
themoviedbKey = fs.readFileSync('themoviedb-key.txt');
if (themoviedbKey == null) {
	process.exit(1);
}
moviedb = module.require("moviedb")(themoviedbKey);
module.exports = MovieQueue();
MovieQueue = function() {
	self = {
		movies : {},
		log : global['log'],
		fuzzy : module.require('fuzzy'),
		rateLimit : require("rate-limit"),
		_ : module.require('underscore'),
		request : module.require('request'),
		queue : self.rateLimit.createQueue({
			interval : 500
		}),
		configuration : {
			base_url : '/'
		},
		imagePath : '/',

		queueMovieName : function(movieName) {
			self.queue.add(function() {
				self.log.debug("Enqueueing name " + movieName);
				moviedb.searchMovie({
					query : '"' + movieName + '"'
				}, self.movieIdFind(movieName));
			});
		},
		queueMovieId : function(id, name) {
			self.queue.add(function() {
				self.log.debug("Enqueueing id " + id);
				self.movies[id] = name;
				moviedb.movieImages({
					id : id
				}, self.movieImageFind(id));
			});
		},
		queueMovieImage : function(id, imagePath) {
			self.queue.add(function() {
				self.log.debug("Enqueueing image " + id);
				self.movieImageFetch(id, imagePath);
			});
		},
		// handles movie fetch from movie id
		movieImageFind : function(id) {
			return function(err, res) {
				// validate
				if (err || res == null || res.posters == null
						|| res.posters.length < 1) {
					self.log.error("Couldn't retrieve '" + self.movies[id]
							+ "': " + err);
					return;
				}
				// default
				image = res.posters[0];
				// find first english
				englishImages = self._.filter(res.posters, function(poster) {
					return poster.iso_639_1 != null
							&& poster.iso_639_1.toLowerCase() == 'en';
				});
				if (englishImages) {
					image = englishImages[0];
				}
				// give up if nothing's worked
				if (image == null) {
					self.log.error("ERROR FINDING ENGLISH POSTER: "
							+ movies[id] + " (" + id + "): ");
					self.log.info(res);
					return;
				}
				self.queueMovieImage(id, image.file_path);
			}
		},
		movieImageFetch : function(id, imageLoc) {
			url = self.configuration.base_url + "w300" + imageLoc;
			dotLoc = imageLoc.lastIndexOf('.');
			ext = imageLoc.substr(dotLoc, imageLoc.length - dotLoc);
			fileName = self.movies[id] + ext;
			fileDestination = self.imagePath + fileName;
			self.log.info("Writing out file " + fileDestination + " for movie "
					+ self.movies[id]);
			request.get(url).on('error', function(err) {
				self.log.error(err)
			}).pipe(self.fs.createWriteStream(fileDestination));
			self.log.always("Wrote image '" + fileDestination + "'");
		},
		// parses results from movies and finds exact title match
		movieIdFind : function(name) {
			return function(err, res) {
				if (err) {
					self.log.error("ERROR: " + err);
					return;
				}
				fuzzymatches = self.fuzzy.filter(name, res.results
						.map(function(result) {
							return result.title;
						}));
				bestmatch = self._.max(fuzzymatches, function(fuzzymatch) {
					return fuzzymatch.score;
				});
				// failsafe -- if no best and only one result, trust the moviedb
				if (self._.isEmpty(bestmatch) && res.results.length == 1) {
					bestmatch = {
						index : 0
					};
				}
				log.info("best match '" + name + "'");
				log.debug(bestmatch);
				if (!self._.isEmpty(bestmatch)) {
					id = res.results[bestmatch.index].id;
					self.log.info("Chose id " + res.results[bestmatch.index].id
							+ " for " + name);
					self.log.debug(res.results[bestmatch.index]);
					self.movies[id] = name;
					self.queueMovieId(id, name);
				} else {
					self.log.error("NO MATCH for title " + name);
					self.log.debug(res.results);
					self.log.debug("fuzzymatches");
					self.log.debug(fuzzymatches);
				}
			};
			return self;
		}
	}
};
