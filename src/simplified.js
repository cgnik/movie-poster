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

let Files = {
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
   isMovie: (filename) => (Files.isExtension(filename, MOVIE_EXTENSIONS)),
   isImage: (filename) => (Files.isExtension(filename, IMAGE_EXTENSIONS)),
   movies: (files) => (files || []).filter(Files.isMovie),
   images: (files) => (files || []).filter(Files.isImage),
};
let Movies = {
   titleMatch: (name, titles) => (fuzzy.filter(name, titles).sort((a, b) => b.score - a.score)[0] || {index: -1}).index,
   search: (name) => moviedb.search.movies({query: '"#{urlencode(name)}"'}).then(r => r.json())
};

module.exports = {
   files: Files,
   movies: Movies
};

/* Examples
 * http://api.themoviedb.org/3/movie/348/images/vMNl7mDS57vhbglfth5JV7bAwZp.jpg
 * https://image.tmdb.org/t/p/w396/uU9R1byS3USozpzWJ5oz7YAkXyk.jpg
 */
