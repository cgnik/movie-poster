// modules
let fs = require('fs');
let Indexer = require('./indexer')
let MovieSource = require('./moviedb-moviedb');

const KEYFILE = 'themoviedb-key.txt';

class Main {
   constructor(p) {
      let params = p || {};
      this.directories = params['directory'] || [];
      this.indexers = {};
      this.themoviedbKey = params['themoviedbKey'];
      this.moviedb = null;
      this.KEYFILE = params['keyfile'] || KEYFILE;
   }

   process() {
      this.initMoviedb();
      this.directories.forEach(directory => {
         this.indexers[directory] = new Indexer(this.moviedb, directory);
         console.info("Indexing directory " + directory);
         this.indexers[directory].initialize();
         this.indexers[directory].process();
      });
   }


   initMoviedb() {
      if (this.themoviedbKey == undefined) {
         this.themoviedbKey = fs.readFileSync(this.KEYFILE);
      }
      this.moviedb = new MovieSource({'themoviedbKey': this.themoviedbKey});
      if (this.moviedb === undefined) {
         throw new Error("Unable to initialize moviedb searching");
      }
   }
}

module.exports = Main;
/* Examples
 * http://api.themoviedb.org/3/movie/348/images/vMNl7mDS57vhbglfth5JV7bAwZp.jpg
 * https://image.tmdb.org/t/p/w396/uU9R1byS3USozpzWJ5oz7YAkXyk.jpg
 */
