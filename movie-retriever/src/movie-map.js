// local movies library -- functions re: movie dir
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
            self.mapMovieFiles(this.movieImages, fs
                .readdirSync(dir));
            self.movieDirectories.push(dir);
        },
        mapMovieFiles: function (movieImages, files) {
            files.forEach(function (fileFullName) {
                mapMovieFile(fileFullName);
            })
            return movieImages;
        },
        mapMovieFile: function (movieImages, fileFullName) {
        },
        isMovieFile: function (fileName) {
            return MOVIE_EXTENSIONS.indexOf(path.extname(fileName).toLowerCase()) >= 0;
        },
        isImageFile: function (fileName) {
            return IMAGE_EXTENSIONS.indexOf(path.extname(fileName).toLowerCase()) >= 0;
        }
    };
    return self;
};
module.exports = MovieMap();
