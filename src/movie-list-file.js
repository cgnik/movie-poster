let fs = require('fs');
let path = require('path');

const MAPFILE = 'movie-map.json';

class MovieListFile {
   constructor(opts) {
      let options = opts || {};
      this.directory = options['directory'] || './';
      this._persistentMapFileName = options['file'] || MAPFILE;
      this.movies = options['movies'] || {};
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
      return Promise.resolve(this.movies);
   }

   persist() {
      if (this.movies !== undefined && Object.keys(this.movies).length > 0) {
         const outfile = path.join(this.directory, this._persistentMapFileName);
         fs.writeFileSync(outfile, JSON.stringify(this.movies));
      } else {
         console.info("Skipping map persist -- nothing to write.");
      }
   }
}

module.exports = MovieListFile;
