/**
 * Created by christo on 8/15/15.
 */

let MovieDb = require('../src/moviedb-moviedb.js');

describe('Indexer', () => {
   let Indexer = require('../src/indexer.js');
   index = null;
   moviemap = null;

   beforeEach(function () {
      let movieDb = sinon.mock(MovieDb);
      movieDb.Events = MovieDb.Events;
      movieDb.on = sinon.stub();
      index = new Indexer(movieDb);
      moviemap = index.movieMap;
      index.throttle = sinon.mock();
   });
   describe('#findMissingMovieIds', () => {
      it('should figure out which mapped movies don"t have IDs', () => {
         index.movieMap.movies.should.deep.equal({});
         testObject = [{
            name: 'Alien',
            file: '/path/Alien.mpg',
            image: '/path/Alien.jpg'
         }, {"name": "Aliens", "file": "/path/Aliens.mpg"}];
         testList = [{'id': 123, 'name': 'blah', 'image': '/path/image.jpg'}];
         testList = testList.concat(testObject);
         moviemap.toList = sinon.stub();
         moviemap.toList.returns(testList);
         index.findMissingMovieIds().should.deep.equal(testObject);
      })
   });
   describe('#findMissingMovieImages', () => {
      it('should figure out which mapped movies don"t have imagess', () => {
         testObject = {"name": "Aliens", "file": "/path/Aliens.mpg"};
         testList = [{'id': 123, 'name': 'blah', 'image': '/path/image.jpg'}, testObject];
         moviemap.toList = sinon.stub().returns(testList);
         index.findMissingMovieImages().should.deep.equal([testObject]);
      })
   });
   describe('#findFetchableImages', () => {
      it('should reply with a list of movies with an imageLoc property and no image file', () => {
         testObject = [{"name": "Aliens", "file": "/path/Aliens.mpg", "imageLoc": "url/url/url"}];
         testList = [{'id': 123, 'name': 'blah', 'image': '/path/image.jpg'}, {
            'id': 456,
            'name': 'blah2',
            'imageLoc': "/something/something",
            'image': '/path/image2.jpg'
         }, {'id': 789, 'name': 'blah3'}];
         testList = testList.concat(testObject);
         moviemap.toList = sinon.stub();
         moviemap.toList.returns(testList);
         index.findFetchableImages().should.deep.equal(testObject);
      })
   });
});