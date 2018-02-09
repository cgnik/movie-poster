movieDbKey = require('fs').readFileSync(__dirname + '/../themoviedb-key.txt', {encoding: 'utf-8'});
const m = require('./util');
const mdb = require('./mdb');
const funcs = require('./funcs')(process.cwd());
const cli = require('command-line-args');

const opts = cli([
   {name: 'command', alias: 'c', type: String, defaultOption: true}
]);

const log = console.log;
const imaginate = (base, titles) => {
   titles.forEach(movie => {
      mdb.search(movie)
         .then(titles => mdb.match(movie, titles))
         .then(data => mdb.check(base, data))
         .then(stream => m.write(stream, movie + ".jpg"))
         .catch(console.error);
   });
};

switch (opts.command) {
   case 'images':
      log("Fetching missing images");
      mdb.config()
         .then(base => imaginate(base, funcs.missing()));
      break;
   case 'missing':
      log("Finding missing images...");
      log("Missing images: ", funcs.missing());
      break;
   default:
      log("Command not understood.");
}
log("Done.");
