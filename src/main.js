// modules
const fs = require('fs');
const Indexer = require('./indexer.js');
const MovieSource = require('./moviedb-moviedb.js');

class Main {
   constructor(p) {
      let params = p || {};
      this.directories = params['directory'] || [];
      this.indexers = {};
      this.moviedb = null;
   }

   process() {
      this.initMoviedb();
      this.directories.forEach(directory => {
         this.indexers[directory] = new Indexer(this.moviedb, directory);
         try {
            console.info("Indexing directory " + directory);
            this.indexers[directory].initialize();
            this.indexers[directory].process();
         } catch (e) {
            console.error("Skipping directory '" + directory + "': " + e);
         }
      });
   }

   initMoviedb() {
      if (this.themoviedbKey == undefined) {
         this.themoviedbKey = fs.readFileSync('themoviedb-key.txt');
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
