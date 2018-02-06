movieDbKey = require('fs').readFileSync(__dirname + '/../themoviedb-key.txt', {encoding: 'utf-8'});
const m = require('./simplified');
const mdb = require('./simplified-mdb');

const files = m.files(process.cwd()).filter(f => m.isMovie(f) || m.isImage(f));
const movies = files.filter(m.isMovie).map(f => m.filename(f));

const imaginate = (base, titles) => {
   console.log("Using base: " + base);
   titles.forEach(movie => {
      mdb.search(movie)
         .then(titles => mdb.match(movie, titles))
         .then(data => mdb.check(base, data))
         .then(stream => m.write(stream, movie + ".jpg"))
         .catch(console.error);
   });
};
mdb.config()
   .then(base => imaginate(base, movies))