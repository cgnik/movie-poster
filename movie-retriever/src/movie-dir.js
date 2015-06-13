// local movies library -- functions re: movie dir
MovieImageMap = function(dir) {
	log = global['log'];
	var self = {
		fs : require('fs'),
		dir : dir,
		movieImages : {},
		getMovieImageMap : function() {
			// gets movie results for each file in movie dir
			return self.mapMovieImageFiles(this.movieImages, self.fs
					.readdirSync(dir));
		},
		mapMovieImageFiles : function(movieImages, files) {
			files.forEach(function(fileFullName) {
				self.mapMovieImageFile(movieImages, fileFullName);
			})
			return movieImages;
		},
		mapMovieImageFile : function(movieImages, fileFullName) {
			fileName = fileFullName.substring(0, fileFullName.lastIndexOf('.'));
			if (fileName.trim().length < 1) {
				// then it's a . file or we're likely not interested
				return;
			}
			// sorting criteria -- what kind of thing is it
			fileExtension = fileFullName.substring(
					fileFullName.lastIndexOf('.'), fileFullName.length)
					.toLowerCase();
			if (self.isMovieFile(fileExtension)) {
				// prevent overwrite
				if (!(fileName in movieImages)) {
					movieImages[fileName] = null;
				}
			} else if (self.isImageFile(fileExtension)) {
				// set the filename for the movie cover art
				self.movieImages[fileName] = fileFullName;
			}
		},
		isMovieFile : function(fileExtension) {
			return fileExtension == ".m4v" || fileExtension == ".mkv"
					|| fileExtension == ".mp4" || fileExtension == ".vob";
		},
		isImageFile : function(fileExtension) {
			return fileExtension == ".jpg" || fileExtension == ".gif"
					|| fileExtension == ".png";
		}
	};
	return self;
};
module.exports = MovieImageMap(".");
