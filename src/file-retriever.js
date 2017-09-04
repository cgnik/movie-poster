let fetch = require('isomorphic-fetch');
let fs = require('fs');

class FileRetriever {
   constructor(p) {
      let params = p || {};
      this.fileName = '';
      this.imagePath = '';
      this.imageLoc = '';
      this.baseUrl = '';
      merge(this, params);
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
      return path.join(path.normalize(this.imagePath), this.fileName
         + this.getExtension(this.imageLoc));
   }

   getUrl() {
      return this.baseUrl + "w300" + this.imageLoc;
   }

   getExtension() {
      var extension = '';
      if (this.imageLoc == null || this.imageLoc === undefined) {
         return;
      }
      var dotLoc = this.imageLoc.lastIndexOf('.');
      if (dotLoc >= 0) {
         extension = this.imageLoc.substr(dotLoc, this.imageLoc.length
            - dotLoc);
      }
      return extension;
   }
}

module.exports = FileRetriever;