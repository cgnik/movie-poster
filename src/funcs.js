const util = require('./util');

const files = (dir) => util.files(dir).filter(f => util.isMovie(f) || util.isImage(f));
const movies = (dir) => util.files(dir).filter(util.isMovie).map(util.filename);
const images = (dir) => util.files(dir).filter(util.isImage).map(util.filename);
const diff = (a, b) => a.filter(f => !b.includes(f));
const missing = (dir) => diff(movies(dir), images(dir));

module.exports = (dir) => {
   let self = {
      files: () => files(dir),
      images: () => images(dir),
      movies: () => movies(dir),
      missing: () => missing(dir)
   };
   return self;
};