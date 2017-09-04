fileList = ['/path/something.file', '/path/something.m4v', '/path/something.png', '/path/other.m4v', 'not_a_movie.bob', 'not_an_image.sally'];

describe('MovieMap', () => {
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
   describe('#clear', () => {
      beforeEach(b);
      it('should clear map', () => {
         mm.movies['something'] = 'something-else';
         expect(mm.movies).to.not.be.empty;
         mm.clear();
         expect(mm.movies).to.be.empty;
      })
   });
   describe('#addMovieFiles', () => {
      beforeEach(b);
      it('should add movie files to the map, respecting existing entries', () => {
         ["/path/something.mpg", "/path/SomeThing.jpg"].forEach(mm.addMovieFile.bind(mm));
         mm.movies.should.deep.equal({
            "something": {
               'key': 'something',
               "name": "SomeThing",
               "file": "/path/something.mpg",
               "image": "/path/SomeThing.jpg",
               "directory": "/path/"
            }
         });
      })
   });
   describe("#addMovieFile", () => {
      beforeEach(b);
      it('should add a movie file to the map, adding to existing entries', () => {
         mm.movies.should.deep.equal({});
         mm.addMovieFile("/path/something.mpg");
         mm.movies.should.deep.equal({
            "something": {
               'key': 'something',
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
               'key': 'something',
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
      it('should preserve the case of the movie title in the name element but not in the key', () => {
         mm.addMovieFile("/path/Something.mpg");
         mm.movies.should.deep.equal({
            'something': {
               'key': 'something',
               'name': 'Something',
               'file': '/path/Something.mpg',
               "directory": "/path/"
            }
         });
      })
   });
   describe('#getMovieByName', () => {
      const testmovieLower = {
         'something': {
            'key': 'something',
            'name': 'something', 'file': '/path/something.mpg', "directory": "/path/"
         }
      };
      const testmovieMixed = {
         'something': {
            "key": 'something',
            'name': 'SomEtHinG', 'file': '/path/SomEtHinG.mPG', "directory": "/path/"
         }
      };
      beforeEach(b);
      it('should return a movie from the map if it has one for that name', () => {
         mm.addMovieFile(testmovieLower.something.file);
         mm.getMovieByName("something").should.deep.equal(testmovieLower);
      });
      it('should ignore case in the movie name', () => {
         mm.addMovieFile(testmovieMixed.something.file);
         mm.getMovieByName("something").should.deep.equal(testmovieMixed);
      })
   });
   describe('#isMovieExtension', () => {
      beforeEach(b);
      it('should identify a movie file regardless of case', () => {
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
   describe('#isImageExtension', () => {
      beforeEach(b);
      it('should identify a image file regardless of case', () => {
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
   describe('#updateMovie', () => {
      beforeEach(b);
      it('should set the named property for the specified movie id to the specified value', () => {
         mm.addMovieFile("/path/some.mpg");
         expect(mm.movies['some'].prop).to.be.undefined;
         mm.updateMovie("some", {'prop': 'propValue'}).should.deep.equal({
            'some': {
               "key": "some",
               "prop": 'propValue',
               "directory": "/path/",
               "file": "/path/some.mpg",
               "name": "some"
            }
         });
      })
   });
   describe('#keyify', () => {
      beforeEach(b);
      it('should make the provided string lower-case for use as a map key for the movie', () => {
         mm.keyify('BlAh').should.equal('blah');
      })
   });
   describe('#toList', () => {
      beforeEach(b);
      it('should return a list of all movies in the map', () => {
         mm.addMovieFile("/path/some.mpg");
         expect(mm.movies['some'].prop).to.be.undefined;
         mm.toList().should.deep.equal(
            [{
               "key": "some",
               "directory": "/path/",
               "file": "/path/some.mpg",
               "name": "some"
            }]
         );
      })
   });
});