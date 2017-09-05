const MovieMap = require("./movie-map.js");
const _ = require('underscore');

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
         console.info("Searching for movie " + movie.name);
         return this.db.searchMovies(movie.name);
      })).then(results => Promise.all(results.map(result => {
         let movieResults = result['searchResult']['results'] || [];
         return this.movieSearchResults(result.movieName, movieResults);
      }))).then(movies => {
         movies.forEach(m => {
            this.movieMap.updateMovie(m.key, m);
         });
         // console.log(this.movieMap.movies);
         return Promise.all(this.findMissingMovieImages().filter(movie => {
            return movie['id'] ? true : false;
         }).map(missing => {
            return this.db.fetchMovieImages(missing.id);
         }))
      }).then(images => {
         console.log(images);
      })
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
      if (movie) {
         if (bestMatchId) {
            movie['id'] = bestMatchId;
         } else {
            movie['error'] = "Not Found";
            movie['results'] = results;
         }
      }
      return new Promise((fulfill, reject) => {
         if (bestMatchId) {
            fulfill(movie);
         } else {
            reject(Error('Movie ' + movieName + ' not found in the map'));
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
