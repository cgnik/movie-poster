let meta = require('ffmetadata');
let _ = require('underscore');

class MetaUpdate {
   updateMovie(movie) {
      return new Promise((fulfill, reject) => {
         meta.read(movie['file'], (err, data) => {
            let result = data;
            if (err) {
               reject(err);
               return;
            } else if (data && data['title'] !== movie['title']) {
               console.log(movie);
               meta.write(movie['file'], {
                  title: movie['title'],
                  description: movie['Description'],
                  comment: movie['Description'],
                  date: movie['date'],
                  ReleaseDate: movie['date']
               }, {}, (e) => {
                  if (e) {
                     console.error(e);
                  } else {
                     console.log("Updated metadata: " + movie['title'])
                  }
               });
            }
            fulfill(result);
         });
      });
   }
}

module.exports = MetaUpdate;