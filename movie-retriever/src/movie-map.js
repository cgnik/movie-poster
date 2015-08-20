// local movies library -- functions re: movie dir
require('./globals.js');
var MOVIE_EXTENSIONS = [".m4v", ".mkv", ".mp4", ".vob", ".mpg", ".mpeg"];
var IMAGE_EXTENSIONS = [".jpg", ".gif", ".png"];
MovieMap = function () {
    var self = {
        movieDirectories: [],
        movieMap: {},
        toList: function () {
            return _.map(self.movieMap, function (k, v) {
                return k;
            });
        },
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
            mcname = path.basename(fileFullName, extname);
            name = mcname.toLowerCase();
            // get or create mapped name
            existing = self.movieMap[name] || {};
            if (existing.name == undefined) {
                existing.name = mcname;
            }
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
        },
        setMovieProperty: function (movieId, propertyName, propertyValue) {
            movie = _.keys(self.movieMap).some(function (key) {
                if (self.movieMap[key].id === movieId) {
                    self.movieMap[key][propertyName] = propertyValue;
                    return true;
                }
            })
        }
    };
    return self;
};
module.exports = MovieMap();
