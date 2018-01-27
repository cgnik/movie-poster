// modules
let fs = require('fs');
let fuzzy = require('fuzzy');
let urlencode = require('urlencode');
let moviedb = require('themoviedatabase');
let _ = require('lodash');

const MOVIE_EXTENSIONS = [".mkv", ".m4v"];
const IMAGE_EXTENSIONS = [".jpg", ".png"];

const highscore = (best, test, idx, arr) => {
   let y = (best.score > test.score);
   return y ? best : test;
}

let Simplified = {
   MOVIE_EXTENSIONS: MOVIE_EXTENSIONS,
   IMAGE_EXTENSIONS: IMAGE_EXTENSIONS,

   indexOfMin: (list) => list ? list.indexOf(_.min(list)) : -1,
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
   isMovie: (filename) => (Simplified.isExtension(filename, MOVIE_EXTENSIONS)),
   isImage: (filename) => (Simplified.isExtension(filename, IMAGE_EXTENSIONS)),
   movies: (files) => (files || []).filter(Simplified.isMovie),
   images: (files) => (files || []).filter(Simplified.isImage),
   searchMovies: (name) => moviedb.search.movies({query: '"#{urlencode(name)}"'}).then(r => r.json()),
   titleMatch: (name, titles) => (fuzzy.filter(name, titles).sort((a,b) => b.score - a.score)[0] || {index:-1}).index
};

module.exports = Simplified;

/* Examples
 * http://api.themoviedb.org/3/movie/348/images/vMNl7mDS57vhbglfth5JV7bAwZp.jpg
 * https://image.tmdb.org/t/p/w396/uU9R1byS3USozpzWJ5oz7YAkXyk.jpg
 */
