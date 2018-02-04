const fs = require('fs');
movieDbKey = fs.readFileSync(__dirname + '/../themoviedb-key.txt', {encoding: 'utf-8'});
movies = require('./simplified');

console.log(movies.files(process.cwd())
   .filter(movies.isMovie)
   .forEach(f => movies.movieImage(movies.fileparts(f)[0])));
