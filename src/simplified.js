let fs = require('fs');
let fuzzy = require('fuzzy');
let _ = require('lodash');

const MOVIE_EXTENSIONS = ["mkv", "m4v", "mp4"];
const IMAGE_EXTENSIONS = ["jpg", "png"];

const arrlast = (arr, idx) => arr && arr.length > 0 ? arr[Math.max(arr.length - 1 - (idx || 0), 0)] : '';
const write = (stream, name) => stream.pipe(fs.createWriteStream(name));
const files = (dir) => dir ? fs.readdirSync(dir).filter(f => fs.statSync(f).isFile()) : [];
const fileparts = (f) => (f || "").match(/([^./\\]+)/g) || [];
const filename = (f) => arrlast(fileparts(f), 1);
const isExtension = (f, exts) => ((exts || []).indexOf(arrlast(fileparts(f)).toLowerCase()) >= 0);
const isMovie = (f) => (isExtension(f, MOVIE_EXTENSIONS));
const isImage = (f) => (isExtension(f, IMAGE_EXTENSIONS));
const movies = (files) => (files || []).filter(isMovie);
const images = (files) => (files || []).filter(isImage);

const titleMatch = (name, titles) => (fuzzy.filter(name, titles).sort((a, b) => b.score - a.score)[0] || {index: -1}).index;

module.exports = {
   MOVIE_EXTENSIONS: MOVIE_EXTENSIONS,
   IMAGE_EXTENSIONS: IMAGE_EXTENSIONS,
   arrlast: arrlast,
   write: write,
   files: files,
   fileparts: fileparts,
   filename: filename,
   isExtension: isExtension,
   isMovie: isMovie,
   isImage: isImage,
   movies: movies,
   images: images,
   titleMatch: titleMatch
};
