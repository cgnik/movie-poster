const fs = require('fs');
const path = require('path');

const IMAGE_EXTENSIONS = [".jpg", ".gif", ".png"];
const MOVIE_EXTENSIONS = [".m4v", ".mkv", ".mp4", ".vob", ".mpg", ".mpeg", ".avi"];

class MovieMap {
   constructor() {
      this.movies = {};
   }

   initialize(directory, initialMap) {
      this.movies = initialMap || {};
      if (directory) {
         this._persistentMapFileName = path.join(directory, MAPFILE);
      }
      this.directory = directory;
      this.addMovieFiles(fs.readdirSync(this.directory));
   }

   clear() {
      this.movies = {};
   }

   addMovieFiles(files) {
      console.info("Mapping files");
      files.forEach((function (fileFullName) {
         this.addMovieFile(fileFullName);
      }).bind(this));
   }

   addMovieFile(fileFullName) {
      console.info("Mapping movie file " + fileFullName);
      // figure out pieces parts of file name
      let fileExtension = path.extname(fileFullName);
      let fileName = path.basename(fileFullName, fileExtension);
      let key = this.keyify(fileName);
      // get or create mapped name
      let existing = this.movies[key] || {};
      existing['name'] = fileName;
      existing['directory'] = path.isAbsolute(fileFullName) ? path.dirname(fileFullName) + "/" : this.directory;
      // shuffle in the right props
      if (this.isMovieExtension(fileExtension)) {
         existing.file = fileFullName;
         this.movies[key] = existing;
      } else if (this.isImageExtension(fileExtension)) {
         existing.image = fileFullName;
         this.movies[key] = existing;
      } else {
         console.info("Skipping non-image-non-movie file: " + fileFullName);
      }
   }

   getMovieByName(name) {
      return {[name]: this.movies[this.keyify(name)]};
   }

   updateMovie(name, props) {
      let movie = this.getMovieByName(name);
      if (movie && props) {
         _.extend(movie[name], props);
      }
      return movie;
   }

   isMovieExtension(fileName) {
      return MOVIE_EXTENSIONS.indexOf(fileName.toLowerCase()) >= 0;
   }

   isImageExtension(fileName) {
      return IMAGE_EXTENSIONS.indexOf(fileName.toLowerCase()) >= 0;
   }

   keyify(s) {
      if (!s) {
         return;
      }
      return s.toString().toLowerCase();
   }
}

module.exports = MovieMap;
