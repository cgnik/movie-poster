movieDbKey = require('fs').readFileSync(__dirname + '/../themoviedb-key.txt', {encoding: 'utf-8'});
const m = require('./util');
const mdb = require('./mdb');
const funcs = require('./funcs')(process.cwd());
const cli = require('command-line-args');


const log = console.log;
const imaginate = (base, titles) => {
   titles.forEach(movie => {
      mdb.search(movie)
         .then(titles => mdb.match(movie, titles))
         .then(data => mdb.check(base, data))
         .then(stream => m.write(stream, movie + ".jpg"))
         .catch(e => console.error(e, ": ", movie));
   });
};

const opts = cli([
   {name: 'command', alias: 'c', type: String, defaultOption: true},
   {name: 'dir', alias: 'd', type: String}
]);
const dir = opts.dir || process.cwd();

switch (opts.command) {
   case 'images':
      log("Fetching missing images");
      mdb.config()
         .then(base => imaginate(base, funcs.missing()));
      break;
   case 'missing':
      log("Missing images: ", funcs.missing());
      break;
   case 'meta':
      // TODO: iterate all movies and update titles, descriptions, etc.
      log("Updating metadata...");
      m.files(dir).filter(m.isMovie).forEach(m => {
         log(m);
      })
      break;
   default:
      log("Unrecognized command");
}
log("Done.");
