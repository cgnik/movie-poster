// modules
let fs = require('fs');
let fuzzy = require('fuzzy');
let urlencode = require('urlencode');
let moviedb = require('themoviedatabase');
let _ = require('lodash');

const MOVIE_EXTENSIONS = ["mkv", "m4v"];
const IMAGE_EXTENSIONS = ["jpg", "png"];


const files = (dir) => dir ? fs.readdirSync(dir).filter(f => fs.statSync(f).isFile()) : [];
const fileparts = (file) => (file || "").match(/(\w+)/g) || [];
const isExtension = (filename, extensions) => {
   const ext = fileparts(filename);
   return (ext.length > 1 && (extensions || []).indexOf(ext[ext.length - 1].toLowerCase()) >= 0);
};
const isMovie = (filename) => (isExtension(filename, MOVIE_EXTENSIONS));
const isImage = (filename) => (isExtension(filename, IMAGE_EXTENSIONS));
const movies = (files) => (files || []).filter(isMovie);
const images = (files) => (files || []).filter(isImage);

const titleMatch = (name, titles) => (fuzzy.filter(name, titles).sort((a, b) => b.score - a.score)[0] || {index: -1}).index;
const search = (name) => moviedb.search.movies({query: '"#{urlencode(name)}"'}).then(r => r.json());
const images = (id) => moviedb.images(id).map();

module.exports = {
   MOVIE_EXTENSIONS: MOVIE_EXTENSIONS,
   IMAGE_EXTENSIONS: IMAGE_EXTENSIONS,
   files: files,
   fileparts: fileparts,
   isExtension: isExtension,
   isMovie: isMovie,
   isImage: isImage,
   movies: movies,
   images: images,
   titleMatch: titleMatch,
   search: search
};

/* Examples
 * http://api.themoviedb.org/3/movie/348/images/vMNl7mDS57vhbglfth5JV7bAwZp.jpg
 * https://image.tmdb.org/t/p/w396/uU9R1byS3USozpzWJ5oz7YAkXyk.jpg
 */
