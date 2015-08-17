// local movies library -- functions re: movie dir
require('./globals.js');
var MOVIE_EXTENSIONS = [".m4v", ".mkv", ".mp4", ".vob", ".mpg", ".mpeg"];
var IMAGE_EXTENSIONS = [".jpg", ".gif", ".png"];
MovieMap = function () {
    var self = {
        movieDirectories: [],
        movieMap: {},
        clear: function () {
            self.movieMap = {};
            self.movieDirectories = [];
        },
        addMovieDirectory: function (dir) {
            self.addMovieFiles(fs
                .readdirSync(dir));
            self.movieDirectories.push(dir);
        },
        addMovieFiles: function (files) {
            files.forEach(function (fileFullName) {
                self.addMovieFile(fileFullName);
            })
        },
        addMovieFile: function (fileFullName) {
            // figure out pieces parts of file name
            extname = path.extname(fileFullName);
            name = path.basename(fileFullName, extname).toLowerCase();
            // get or create mapped name
            existing = self.movieMap[name] || {};
            existing.name = name;
            // shuffle in the right props
            if (self.isMovieExtension(extname)) {
                existing.file = fileFullName;
                self.movieMap[name] = existing;
            } else if (self.isImageFile(extname)) {
                existing.image = fileFullName;
                self.movieMap[name] = existing;
            } else {
                log.info("Skipping non-image-non-movie file: " + fileFullName);
            }
        },
        isMovieExtension: function (fileName) {
            return MOVIE_EXTENSIONS.indexOf(fileName.toLowerCase()) >= 0;
        },
        isImageFile: function (fileName) {
            return IMAGE_EXTENSIONS.indexOf(fileName.toLowerCase()) >= 0;
        }
    };
    return self;
};
module.exports = MovieMap();
