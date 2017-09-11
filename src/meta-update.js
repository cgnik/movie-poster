let meta = require('ffmetadata');

class MetaUpdate {
   updateMovie(movie) {
      meta.read(movie['file'], (err, data) => {
         if (err) {
            console.error(err);
         } else {
            if (data['title'] !== movie['title']) {
               ff.write(movie['file'], _.extend(data, {title: movie['title']}))
            }
         }
      });
   }
}

module.exports = MetaUpdate;