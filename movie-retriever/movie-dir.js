// local movies library -- functions re: movie dir
fs = module.require("fs");
module.exports = {
	MovieImageMap : function(dir) {
		return {
			dir : dir,
			movieImages : {},
			getMovieImageMap : function() {
				// gets movie results for each file in movie dir
				return mapMovieImageFiles(fs.readdirSync(dir));
			},

		};
	},
};

function mapMovieImageFiles(files) {
	var movieImages = {};
	for (i = 0; i < files.length; i++) {
		fileFullName = files[i];
		fileName = fileFullName.substring(0, fileFullName.lastIndexOf('.'));
		if (fileName.trim().length < 1) {
			// then it's a . file or something else we're likely not
			// interested in
			continue;
		}
		// sorting criteria -- what kind of thing is it
		fileExtension = fileFullName.substring(fileFullName.lastIndexOf('.'),
				fileFullName.length).toLowerCase();
		if (isMovieFile(fileExtension)) {
			// only put it in the array if it's not already there to
			// prevent overwrite
			if (!(fileName in movieImages)) {
				movieImages[fileName] = null;
			}
		} else if (isImageFile(fileExtension)) {
			// set the filename for the movie cover art
			movieImages[fileName] = fileFullName;
		} else {
			// console.log("Unidentified movie type: " + fileFullName + ": ext "
			// + fileExtension);
		}
	}
	return movieImages;
}
function isMovieFile(fileExtension) {
	return fileExtension == ".m4v" || fileExtension == ".mkv"
			|| fileExtension == ".mp4";
}
function isImageFile(fileExtension) {
	return fileExtension == ".jpg" || fileExtension == ".gif"
			|| fileExtension == ".png";

}