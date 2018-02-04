const fs = require('fs');
movieDbKey = fs.readFileSync(__dirname + '/../themoviedb-key.txt', {encoding: 'utf-8'});
const m = require('./simplified');

m.files(process.cwd())
   .filter(m.isMovie)
   .forEach(f => m.movieSearch(m.filename(f)))
   .then(movie => movie[m.titleMatch(name, m.map(m => m.title))])
   .then(t => m.movieImageFetch(name, t)
      .then((c, movieData) => m.movieImageFileFetch(c.images.base_url, movieData))
      .then(f => f.status < 299 ? write(f.body, `${name}.jpg`) : Promise.reject('Unable to retrieve ' + f.url + " : " + f.status)))
   .catch(console.error);