const urlencode = require('urlencode');
const Fetcher = require('./file-retriever.js');
const mdb = require('themoviedatabase');

class MovieDbMovieDb {
   constructor(p) {
      let params = p || {};
      // we require the key for api access to be in this file
      if (params.themoviedbKey == undefined && params.moviedb == undefined) {
         throw new Error("Unable to proceed.  The MovieDB API cannot be used without a valid key.")
      }
      this.moviedb = params.moviedb;
      this.themoviedbKey = params.themoviedbKey;
      if (this.moviedb == undefined) {
         console.info("Initializing moviedb");
         this.moviedb = new mdb(this.themoviedbKey);
      }
      if (this.moviedb === undefined) {
         throw new Error("Unable to load moviedb");
      }
   }

   searchMovies(movieName) {
      if (movieName == undefined || movieName == null) {
         throw new Error("Cannot search movies with null name");
      }
      return new Promise((fulfill, reject) => {
         this.moviedb.search.movies({
            query: '"' + urlencode(movieName) + '"'
         }).then(result => {
            fulfill({movieName: movieName, searchResult: result})
         }, reject);
      });
   }

   fetchMovieImages(movieId) {
      return new Promise((fulfill, reject) => {
         this.moviedb.movies.images({
            id: movieId
         }, result => {
            fulfill({movieId: movieId, images: result.posters || []})
         }, reject);
      });
   }

   fetchMovieImage(movie) {
      let props = {
         fileName: movie.name,
         imagePath: movie.directory,
         imageLoc: movie.imageUrl,
         baseUrl: this.configuration.images.base_url
      };
      let fetch = new Fetcher(props);
      return fetch.retrieve();
   }

   findBestTitleMatch(title, titleList) {
      if (!title || !titleList) {
         throw Error("Cannot match movie name (" + title + ") or list (" + titleList + ") which is null.");
      }
      var reduced = titleList
         .map(function (n) {
            return n.title || '';
         });
      console.debug("fuzzy-searching title: " + title + "; reduced: " + reduced);
      let fuzzymatches = fuzzy.filter(title, reduced);
      let bestmatch = _.max(fuzzymatches, function (fuzzymatch) {
         return fuzzymatch.score;
      });
      // failsafe -- if no best and only one result, trust the moviedb
      if (_.isEmpty(bestmatch) && titleList.length == 1) {
         bestmatch = {
            index: 0
         };
      }
      // log and respond
      var id = null;
      if (!_.isEmpty(bestmatch)) {
         id = titleList[bestmatch.index].id;
         console.info("Chose id " + titleList[bestmatch.index].id + " for " + title);
      } else {
         console.error("NO MATCH for title " + title);
      }
      return id;
   }

   // res.posters from moviedb poster search
   findBestPoster(movieId, movieImageList) {
      // validate
      if (movieId == null || movieId == undefined ||
         movieImageList == null || movieImageList == null) {
         throw new Error("Couldn't retrieve '" + movieId);
      } else if (movieImageList.length < 1) {
         return undefined;
      }
      // default
      let image = movieImageList[0];
      // find first english
      let englishImages = _.filter(movieImageList, function (poster) {
         return poster.iso_639_1 != null
            && poster.iso_639_1.toLowerCase() == 'en';
      });
      if (englishImages && englishImages.length > 0) {
         image = englishImages[0];
      }
      // give up if nothing's worked
      if (image == null) {
         log.error("ERROR FINDING ENGLISH POSTER: " + movieId);
         log.info(movieImageList);
         return;
      }
      return image.file_path;
   }
}

module.exports = MovieDbMovieDb;