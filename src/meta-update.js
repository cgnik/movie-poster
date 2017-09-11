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
            } else if (data['title'] !== movie['title']) {
               result = _.extend(data, {title: movie['title']});
               meta.write(movie['file'], result)
            }
            fulfill(result);
         })
      });
   }
}

module.exports = MetaUpdate;