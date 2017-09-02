const fs = require('fs');
const path = require('path');

const MAPFILE = 'movie-map.json';

const IMAGE_EXTENSIONS = [".jpg", ".gif", ".png"];
const MOVIE_EXTENSIONS = [".m4v", ".mkv", ".mp4", ".vob", ".mpg", ".mpeg", ".avi"];

class MovieMap {
   constructor() {
      this._persistentMapFileName = MAPFILE;
      this.movies = {};
   }

   initialize(directory) {
      if (directory) {
         this._persistentMapFileName = path.join(directory, MAPFILE);
      }
      this.directory = directory;
      this.load();
      this.addMovieFiles(fs.readdirSync(this.directory));
   }

   load() {
      if (fs.existsSync(this._persistentMapFileName)) {
         let fstat = fs.statSync(this._persistentMapFileName);
         if (fstat && fstat.isFile()) {
            this.movies = JSON.parse(fs.readFileSync(this._persistentMapFileName));
         } else {
            console.warning(this.persistentMapFileName + " Exists but is not a file. Unable to load initial map. Continuing.");
         }
      } else {
         console.info("Pre-existing map file " + this._persistentMapFileName + " not found.");
      }
   }

   persist() {
      if (this.movies !== undefined && Object.keys(this.movies).length > 0) {
         fs.createWriteStream(this._persistentMapFileName).write(JSON.stringify(this.movies)).close();
      } else {
         console.info("Skipping map persist -- nothing to write.");
      }
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
