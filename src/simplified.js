// modules
let fs = require('fs');
let fuzzy = require('fuzzy');
let urlencode = require('urlencode');
let moviedb = require('themoviedatabase');


const MOVIE_EXTENSIONS = [".mkv", ".m4v"];
const IMAGE_EXTENSIONS = [".jpg", ".png"];

const highscore = (best, test, idx, arr) => (arr[best.index].score > test.score) ? best : test;

module.exports = {
   MOVIE_EXTENSIONS: MOVIE_EXTENSIONS,
   IMAGE_EXTENSIONS: IMAGE_EXTENSIONS,

   files: (dir) => {
      return dir ? fs.readdirSync(dir)
         .filter(f => fs.statSync(f).isFile()) : [];
   },
   isExtension: (filename, extensions) => {
      const ext = (filename || "").toLowerCase().match(/\.(\w+)$/);
      return (ext != null &&
         ext.length > 0 &&
         (extensions || []).indexOf(ext[0]) >= 0);
   },
   isMovie: (filename) => (module.exports.isExtension(filename, MOVIE_EXTENSIONS)),
   isImage: (filename) => (module.exports.isExtension(filename, IMAGE_EXTENSIONS)),
   movies: (files) => (files || []).filter(module.exports.isMovie),
   images: (files) => (files || []).filter(module.exports.isImage),
   searchMovies: (movieName) => moviedb.search.movies({query: '"' + urlencode(movieName) + '"'})
      .then(r => r.json()),
   titleMatch: (name, titles) => fuzzy.filter(name, (titles || []))
      .reduce(highscore, {index: -1})
};


/* Examples
 * http://api.themoviedb.org/3/movie/348/images/vMNl7mDS57vhbglfth5JV7bAwZp.jpg
 * https://image.tmdb.org/t/p/w396/uU9R1byS3USozpzWJ5oz7YAkXyk.jpg
 */
