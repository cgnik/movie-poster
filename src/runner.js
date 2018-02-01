movies = require('./simplified');

console.log(movies.files(process.cwd())
   .filter(movies.isMovie)
   .forEach(f => movies.movieImage(movies.fileparts(f)[0])))
// movies.movieImage("Aliens");
