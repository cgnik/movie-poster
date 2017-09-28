let meta = require('ffmetadata');
let MergeMap = require('./mergemap');
let _ = require('underscore');

class MetaUpdate {

   constructor() {
      this.metaMap = {
         Title: 'title',
         Description: 'description',
         comment: 'description'
      };
      this.metaConst = {
         ContentType: 1
      }
      this.merger = new MergeMap(this.metaMap, this.metaConst);
   }

   updateMovie(movie) {
      const merger = new MergeMap(null, this.metaMap);
      return new Promise((fulfill, reject) => {
         meta.read(movie['file'], (err, data) => {
            let result = data;
            if (err) {
               reject(err);
               return;
            } else if (data && data['title'] !== movie['title']) {
               result = this.merger.meta(movie);
               meta.write(movie['file'], result, {}, (e) => {
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