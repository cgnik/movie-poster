movieDbKey = require('fs').readFileSync(__dirname + '/../themoviedb-key.txt', {encoding: 'utf-8'});
const m = require('./util');
const mdb = require('./mdb');
const meta = require('./meta');
const funcs = require('./funcs')(process.cwd());
const cli = require('command-line-args');


const log = console.log;
const usage = () => {
   return "movie-poster utility for retrieving movie postes and metadata for mkv and mp4 collections.\n" +
      "Usage: node main.js command\n" +
      "...where command is one or more of: \n" +
      "\timages : retrieve movie poster images for cover art - files will be named the same as the corresponding movie file\n" +
      "\tmissing: reports which images would be retrieved if the 'images' command were to be used\n" +
      "\tmeta: retrieves and attempts to set metadata in the movie file\n" +
      "\nNOTE: movie-poster will operate only in the current directory." +
      ""
      ;
};
const imaginate = (base, titles) => {
   titles.forEach(movie => {
      mdb.search(movie)
         .then(titles => mdb.match(movie, titles))
         .then(data => mdb.check(base, data))
         .then(stream => m.write(stream, movie + ".jpg"))
         .catch(e => console.error(e, ": ", movie));
   });
};
const updaterate = (movieFile) => {
   let mname = m.filename(movieFile);
   mdb.search(mname)
      .then(titles => mdb.match(mname, titles))
      .then(data => {
         if (!data || Object.keys(data).length < 1) {
            log("No data found for movie file ", movieFile);
            return;
         }
         let d = meta.read(movieFile);
         d = meta.merge(d, data, meta.MOVIE_FIELD_MAP);
         if (d && meta.write(movieFile, d)) {
            console.log("Updated metadata for ", mname);
         } else {
            console.error("Unable to update meta for ", mname);
         }
      });
};

const opts = cli([
   {name: 'command', alias: 'c', type: String, defaultOption: true, multiple: true},
   {name: 'dir', alias: 'd', type: String}
]);

const dir = opts.dir || process.cwd();

if (Array.isArray(opts.command)) {
   opts.command.forEach(command => {
      switch (command) {
         case 'images':
            log("Fetching missing images");
            mdb.config()
               .then(base => imaginate(base, funcs.missing()));
            break;
         case 'missing':
            log("Missing images: ", funcs.missing());
            break;
         case 'meta':
            log("Updating metadata...");
            m.files(dir).filter(m.isMovie).forEach(mfile => {
               updaterate(mfile);
            });
            break;
         default:
            log("Unrecognized command. ", usage());
      }
   });
} else {
   log(usage());
}
log("Done.");
