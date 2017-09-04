const MovieMap = require("./movie-map.js");

// configuration
class Indexer {
   constructor(moviedb, dir) {
      this.dir = dir;
      this.db = moviedb;
      this.movieMap = new MovieMap();
   }

   // note -- if the movie name is already in here, we don't re-search it
   initialize(params) {
      params = params || {};
      this.dir = params.dir || this.dir;
      this.movieMap.initialize(this.dir);
   }

   process() {
      return Promise.all(this.findMissingMovieIds().map(movie => {
         return this.db.searchMovies(movie.name);
      })).then(movies => {
         return Promise.all(movies.map(movie => {
            console.out('Found movie: ' + JSON.stringify(movie));
            return this.movieSearchResults(movie);
         }));
      });
   }

   // Finds missing ids in moviemap and enqueues fetches
   findMissingMovieIds() {
      return this.movieMap.toList().filter(movie => !movie.id);
   }

   // Finds missing posters in moviemap and enqueues fetches
   findMissingMovieImages() {
      return this.movieMap.toList().filter(movie => !movie.image);
   }

   // Finds movies that have an imageLoc and no image property
   findFetchableImages() {
      return this.movieMap.toList().filter(movie => movie.imageLoc !== undefined && movie.image === undefined);
   }

   movieSearchResults(movieName, results) {
      let bestMatchId = this.db.findBestTitleMatch(movieName, results);
      let movie = this.movieMap.getMovieByName(movieName);
      return new Promise((fulfill, reject) => {
         if (movie) {
            if (bestMatchId) {
               movie.id = bestMatchId;
            } else {
               movie['error'] = "Not Found";
               movie['results'] = results;
            }
            fulfill(movie);
         } else {
            // couldn't find the movie
            reject(Error('Movie ' + movieName + ' not found in the map'));
            console.error("Could not find movie '" + movieName + "' in the map");
         }
      });
   }

   enqueueSearchImages() {
      // this.enqueueSearchImage(movie.id);
   }

   enqueueSearchImage(movieId) {
      // let poster = this.db.findBestPoster(movieId, images);
      // let movie = this.movieMap.getMovieById(movieId);
      // movie['imageUrl'] = poster;
   }

   enqueueFetchImage(movieId) {
      // this.db.fetchMovieImage(movie);
   }
}

module.exports = Indexer;
