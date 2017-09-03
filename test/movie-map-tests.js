fileList = ['/path/something.file', '/path/something.m4v', '/path/something.png', '/path/other.m4v', 'not_a_movie.bob', 'not_an_image.sally'];

describe('MovieMap', function () {
   const MovieMap = rewire('../src/movie-map.js');
   let mm = null;
   let fs = null;
   let b = function () {
      fs = {
         existsSync: sinon.stub(),
         readFileSync: sinon.stub(),
         statSync: sinon.stub()
      };
      MovieMap.__set__('fs', fs);
      mm = new MovieMap('/some/dir/');
      mm.clear();
   };
   describe('#clear', function () {
      beforeEach(b);
      it('should clear map', function () {
         mm.movies['something'] = 'something-else';
         expect(mm.movies).to.not.be.empty;
         mm.clear();
         expect(mm.movies).to.be.empty;
      })
   });
   describe('#addMovieFiles', function () {
      beforeEach(b);
      it('should add movie files to the map, respecting existing entries', function () {
         mm.addMovieFiles(["/path/something.mpg", "/path/SomeThing.jpg"]);
         mm.movies.should.deep.equal({
            "something": {
               "name": "SomeThing",
               "file": "/path/something.mpg",
               "image": "/path/SomeThing.jpg",
               "directory": "/path/"
            }
         });
      })
   });
   describe("#addMovieFile", function () {
      beforeEach(b);
      it('should add a movie file to the map, adding to existing entries', function () {
         mm.movies.should.deep.equal({});
         mm.addMovieFile("/path/something.mpg");
         mm.movies.should.deep.equal({
            "something": {
               "name": "something",
               "file": "/path/something.mpg",
               "directory": "/path/"
            }
         });
      });
      it('should add non-movie image files to the map', () => {
         beforeEach(b);
         mm.addMovieFile("/path/SomeThing.jpg");
         mm.movies.should.deep.equal({
            "something": {
               "directory": "/path/",
               "image": "/path/SomeThing.jpg",
               "name": "SomeThing"
            }
         });
      });
      it('should not add non-movie non-image files to the map', () => {
         beforeEach(b);
         mm.addMovieFile("/path/SomeThing.juju");
         mm.movies.should.deep.equal({});
      });
      it('should preserve the case of the movie title in the name element but not in the key', function () {
         mm.addMovieFile("/path/Something.mpg");
         mm.movies.should.deep.equal({
            'something': {
               'name': 'Something',
               'file': '/path/Something.mpg',
               "directory": "/path/"
            }
         });
      })
   });
   describe('#getMovieByName', function () {
      const testmovieLower = {
         'something': {
            'name': 'something', 'file': '/path/something.mpg', "directory": "/path/"
         }
      };
      const testmovieMixed = {
         'something': {
            'name': 'SomEtHinG', 'file': '/path/SomEtHinG.mPG', "directory": "/path/"
         }
      };
      beforeEach(b);
      it('should return a movie from the map if it has one for that name', function () {
         mm.addMovieFile(testmovieLower.something.file);
         mm.getMovieByName("something").should.deep.equal(testmovieLower);
      });
      it('should ignore case in the movie name', () => {
         mm.addMovieFile(testmovieMixed.something.file);
         mm.getMovieByName("something").should.deep.equal(testmovieMixed);
      })
   });
   describe('#isMovieExtension', function () {
      beforeEach(b);
      it('should identify a movie file regardless of case', function () {
         expect(mm.isMovieExtension('.M4V')).to.be.true;
         expect(mm.isMovieExtension('.mP4')).to.be.true;
         expect(mm.isMovieExtension('.mpg')).to.be.true;
         expect(mm.isMovieExtension('.vob')).to.be.true;
         expect(mm.isMovieExtension('.mkv')).to.be.true;
         expect(mm.isMovieExtension('.mpEg')).to.be.true;

         expect(mm.isMovieExtension('.png')).to.be.false;
         expect(mm.isMovieExtension('.GIF')).to.be.false;
         expect(mm.isMovieExtension('.Jpg')).to.be.false;
      })
   });
   describe('#isImageExtension', function () {
      beforeEach(b);
      it('should identify a image file regardless of case', function () {
         expect(mm.isImageExtension('.M4V')).to.be.false;
         expect(mm.isImageExtension('.mP4')).to.be.false;
         expect(mm.isImageExtension('.mpg')).to.be.false;
         expect(mm.isImageExtension('.vob')).to.be.false;
         expect(mm.isImageExtension('.mkv')).to.be.false;
         expect(mm.isImageExtension('.mpEg')).to.be.false;

         expect(mm.isImageExtension('.png')).to.be.true;
         expect(mm.isImageExtension('.GIF')).to.be.true;
         expect(mm.isImageExtension('.Jpg')).to.be.true;
      })
   });
   describe('#updateMovie', function () {
      beforeEach(b);
      it('should set the named property for the specified movie id to the specified value', function () {
         mm.addMovieFile("/path/some.mpg");
         expect(mm.movies['some'].prop).to.be.undefined;
         mm.updateMovie("some", {'prop': 'propValue'}).should.deep.equal({
            'some': {
               "prop": 'propValue',
               "directory": "/path/",
               "file": "/path/some.mpg",
               "name": "some"
            }
         });
      })
   });
   describe('#keyify', function () {
      beforeEach(b);
      it('should make the provided string lower-case for use as a map key for the movie', function () {
         mm.keyify('BlAh').should.equal('blah');
      })
   });
});