let fetch = require('isomorphic-fetch');
let fs = require('fs');
let _ = require('underscore');

class FileRetriever {
   constructor(p) {
      let params = p || {};
      this.params = _.extend({
         fileName: '',
         imagePath: '',
         imageLoc: '',
         baseUrl: ''
      }, params);
   }

   retrieve() {
      return fetch(this.getUrl()).then(result => {
         if (result.status > 299) {
            console.error(result.status);
            return Promise.reject(result.status);
         }
         fs.writeFileSync(this.getTargetFile(), result)
         return result.blob();
      })
   }

   getTargetFile() {
      return path.join(path.normalize(this.params.imagePath), this.params.fileName
         + this.getExtension(this.params.imageLoc));
   }

   getUrl() {
      return this.params.baseUrl + "w300" + this.params.imageLoc;
   }

   getExtension() {
      var extension = '';
      if (!this.params.imageLoc) {
         return;
      }
      var dotLoc = this.params.imageLoc.lastIndexOf('.');
      if (dotLoc >= 0) {
         extension = this.params.imageLoc.substr(dotLoc, this.params.imageLoc.length
            - dotLoc);
      }
      return extension;
   }
}

module.exports = FileRetriever;