// local movies library -- functions re: movie dir
fs = module.require("fs");
module.exports = {
	MovieImageMap : function(dir) {
		return {
			dir : dir,
			movieImages : {},
			getMovieImageMap : function() {
				// gets movie results for each file in movie dir
				return mapMovieImageFiles(this.movieImages, fs.readdirSync(dir));
			},

		};
	},
};

function mapMovieImageFiles(movieImages, files) {
	files.forEach(function(fileFullName) {
		mapMovieImageFile(movieImages, fileFullName);
	})
	return movieImages;
}
function mapMovieImageFile(movieImages, fileFullName) {
	fileName = fileFullName.substring(0, fileFullName.lastIndexOf('.'));
	if (fileName.trim().length < 1) {
		// then it's a . file or we're likely not interested
		return;
	}
	// sorting criteria -- what kind of thing is it
	fileExtension = fileFullName.substring(fileFullName.lastIndexOf('.'),
			fileFullName.length).toLowerCase();
	if (isMovieFile(fileExtension)) {
		// prevent overwrite
		if (!(fileName in movieImages)) {
			movieImages[fileName] = null;
		}
	} else if (isImageFile(fileExtension)) {
		// set the filename for the movie cover art
		movieImages[fileName] = fileFullName;
	}
}
function isMovieFile(fileExtension) {
	return fileExtension == ".m4v" || fileExtension == ".mkv"
			|| fileExtension == ".mp4";
}
function isImageFile(fileExtension) {
	return fileExtension == ".jpg" || fileExtension == ".gif"
			|| fileExtension == ".png";

}