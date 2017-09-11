const MovieMap = require("./movie-map.js");
const _ = require('underscore');
const MovileListFile = require('./movie-list-file');

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
      this.movieListFile = new MovileListFile({directory: this.movieMap.directory});
      this.movieListFile.load();
      this.movieMap.initialize(this.dir, this.movieListFile.movies);
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
            return movie['id'] && !movie['image'] ? true : false;
         }).map(missing => {
            return this.db.fetchMovieImage(missing);
         }));
      }).then(movies =>
         this.db.fetchMovieImageFiles(movies)
      ).then(images => {
         this.movieListFile.persist();
      })
   }

   // Finds missing ids in moviemap and enqueues fetches
   findMissingMovieIds() {
      return this.movieMap.toList();//.filter(movie => !movie.id);
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
      let bestMatchId = this.db.findBestTitleMatch(movieName, results) || {};
      let bestMatch = _.find(results, {id: bestMatchId});
      let movie = this.movieMap.getMovieByName(movieName);
      if (movie) {
         if (bestMatch['id']) {
            this.movieMap.updateMovie(movieName, {
               id: bestMatchId,
               Description: bestMatch['overview'],
               ReleaseDate: bestMatch['release_date']
            });
         } else {
            movie['error'] = "Not Found";
         }
      }
      return new Promise((fulfill, reject) => {
         if (movie['id']) {
            fulfill(movie);
         } else {
            console.log(movie);
            console.log(bestMatch);
            reject(Error('Movie ' + movieName + ' not found in the map'));
         }
      });
   }
}

module.exports = Indexer;
