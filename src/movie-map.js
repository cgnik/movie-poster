let fs = require('fs');
const _ = require('underscore');

const path = require('path');

const IMAGE_EXTENSIONS = [".jpg", ".gif", ".png"];
const MOVIE_EXTENSIONS = [".m4v", ".mkv", ".mp4", ".vob", ".mpg", ".mpeg", ".avi"];

class MovieMap {
   constructor() {
      this.movies = {};
   }

   initialize(directory, initialMap) {
      this.movies = initialMap || {};
      this.directory = directory;
      fs.readdirSync(this.directory).forEach(this.addMovieFile.bind(this));
   }

   clear() {
      this.movies = {};
   }

   addMovieFile(fileFullName) {
      if (fileFullName.startsWith('.')) {
         return;
      }
      console.info("Mapping movie file " + fileFullName);
      // figure out pieces parts of file name
      let fileExtension = path.extname(fileFullName);
      let fileName = path.basename(fileFullName, fileExtension);
      let key = this.keyify(fileName);
      // get or create mapped name
      let movie = this.movies[key] || {};
      movie['key'] = key;
      movie['name'] = fileName;
      let dir = path.dirname(fileFullName);
      if(dir[dir.length-1] != path.sep){
         dir += path.sep;
      }
      if (this.directory && !path.isAbsolute(fileFullName)) {
         fileFullName = path.join(this.directory, fileFullName);
      }
      movie['directory'] = this.directory ? path.join(this.directory, dir) : dir;
      // shuffle in the right props
      if (this.isMovieExtension(fileExtension)) {
         movie['file'] = fileFullName;
         this.movies[key] = movie;
      } else if (this.isImageExtension(fileExtension)) {
         movie.image = fileFullName;
         this.movies[key] = movie;
      } else {
         console.info("Skipping non-image-non-movie file: " + fileFullName);
      }
   }

   getMovieByName(name) {
      return this.movies[this.keyify(name)];
   }

   updateMovie(name, props) {
      let movie = this.getMovieByName(name);
      if (movie && props) {
         movie = _.extend(movie, props);
         this.movies[movie.key] = movie;
      }
      return movie;
   }

   getMap() {
      return this.movies;
   }

   toList() {
      return Object.keys(this.movies).map(k => this.movies[k]);
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
