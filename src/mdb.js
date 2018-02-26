let urlencode = require('urlencode');
let moviedb = new (require('themoviedatabase'))(movieDbKey);
let fetch = require('isomorphic-fetch');
let util = require('./util')

const config = () => moviedb.configuration().then(c => Promise.resolve(c.images.base_url));
const match = (name, titles) => Promise.resolve(titles[util.titleMatch(name, titles.map(t => t.title))]);
const search = (name) => moviedb.search.movies({
   query: `${urlencode(name)}`,
   language: "en-US"
}).then(r => Promise.resolve(r.results || []));
const poster = (base, movie) => fetch(base + 'w780' + movie.poster_path).then(r => r.status < 300 ? Promise.resolve(r.body) : Promise.reject("No body"));
const check = (base_url, data) => (data ? poster(base_url, data) : Promise.reject('No matching movie data'));

module.exports = {
   config: config,
   search: search,
   match: match,
   check: check,
   poster: poster
};

/* Examples
 *
 * http://api.themoviedb.org/3/movie/348/images/vMNl7mDS57vhbglfth5JV7bAwZp.jpg
 * https://image.tmdb.org/t/p/w396/uU9R1byS3USozpzWJ5oz7YAkXyk.jpg
 */

/*
let meta = require('ffmetadata');
let _ = require('lodash');

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

// TESTS

let Meta = rewire('../src/meta-merge');
describe('MetaUpdate', () => {
   let meta = null;
   let ff = null;
   let b4e = function () {
      meta = new Meta();
      ff = {
         read: sinon.stub(),
         write: sinon.stub()
      };
      Meta.__set__('meta', ff);
   };
   describe('#updateMovie', () => {
      beforeEach(b4e);
      it('only merge the movie if there is something to merge', () => {
         beforeEach(b4e);
         const testMovie = {
            file: '/some/file.mpg',
            name: 'Test TITLE'
         };
         const testMetaData = {
            title: testMovie.title
         };
         meta.updateMovie(testMovie);
         ff.read.callsArgWith(2, null, testMetaData);
         ff.read.should.have.been.calledOnce;
         ff.write.should.not.have.been.called;
      });
      it('updates the movie title and description', (done) => {
         beforeEach(b4e);
         const testMovie = {
            file: '/some/file.mpg',
            title: 'Test TITLE'
         };
         const testMetaData = {
            title: 'BooBoo',
            Description: 'TEST Description'
         };
         const testResult = {
            ContentType: 1,
            Title: testMovie.title
         };
         ff.read.callsArgWith(1, null, testMetaData);
         meta.updateMovie(testMovie).then(result => {
            result.should.deep.equal(testResult);
            ff.read.should.have.been.calledOnce;
            ff.write.should.have.been.calledOnce;
            done();
         }).catch(done);
      });
   });
});
 */