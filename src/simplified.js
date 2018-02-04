let fs = require('fs');
let fuzzy = require('fuzzy');
let urlencode = require('urlencode');
let moviedb = new (require('themoviedatabase'))(movieDbKey);
let _ = require('lodash');
let fetch = require('isomorphic-fetch');

const MOVIE_EXTENSIONS = ["mkv", "m4v", "mp4"];
const IMAGE_EXTENSIONS = ["jpg", "png"];

const arrlast = (arr) => arr && arr.length > 0 ? arr[arr.length - 1] : '';
const write = (stream, name) => stream.pipe(fs.createWriteStream(name));
const files = (dir) => dir ? fs.readdirSync(dir).filter(f => fs.statSync(f).isFile()) : [];
const fileparts = (file) => (file || "").match(/([^./\\]+)/g) || [];
const isExtension = (filename, extensions) => ((extensions || []).indexOf(arrlast(fileparts(filename)).toLowerCase()) >= 0);
const isMovie = (filename) => (isExtension(filename, MOVIE_EXTENSIONS));
const isImage = (filename) => (isExtension(filename, IMAGE_EXTENSIONS));
const movies = (files) => (files || []).filter(isMovie);
const images = (files) => (files || []).filter(isImage);

const titleMatch = (name, titles) => (fuzzy.filter(name, titles).sort((a, b) => b.score - a.score)[0] || {index: -1}).index;

const movieConfig = () => moviedb.configuration();
const movieSearch = (name) => moviedb.search.movies({query: `${urlencode(name)}`}).then(r => r['results'] || []);
const movieImageFetch = (movieData) => (movieData ? movieConfig() : Promise.reject("No data"));
const movieImage = (name) => movieSearch(name)
   .then(m => m[titleMatch(name, m.map(m => m.title))])
   .then(t => movieImageFetch(t)
      .then(c => fetch(c.images.base_url + 'w780' + t["poster_path"]))
      .then(f => f.status < 299 ? write(f.body, `${name}.jpg`) : Promise.reject('Unable to retrieve ' + f.url + " : " + f.status)))
   .catch(console.error);

module.exports = {
   MOVIE_EXTENSIONS: MOVIE_EXTENSIONS,
   IMAGE_EXTENSIONS: IMAGE_EXTENSIONS,
   arrlast: arrlast,
   write: write,
   files: files,
   fileparts: fileparts,
   isExtension: isExtension,
   isMovie: isMovie,
   isImage: isImage,
   movies: movies,
   images: images,
   titleMatch: titleMatch,
   movieConfig: movieConfig,
   movieSearch: movieSearch,
   movieImage: movieImage
};


/* Examples
 *
 * http://api.themoviedb.org/3/movie/348/images/vMNl7mDS57vhbglfth5JV7bAwZp.jpg
 * https://image.tmdb.org/t/p/w396/uU9R1byS3USozpzWJ5oz7YAkXyk.jpg
 */
