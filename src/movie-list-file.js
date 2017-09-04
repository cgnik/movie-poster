let fs = require('fs');
let path = require('path');

const MAPFILE = 'movie-map.json';

class MovieListFile {
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
}

module.exports = MovieListFile;
