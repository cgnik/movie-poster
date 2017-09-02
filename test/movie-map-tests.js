fileList = ['/path/something.file', '/path/something.m4v', '/path/something.png', '/path/other.m4v'];
const fileListMapResult = {
   something: {
      name: 'something',
      file: '/path/something.m4v',
      image: '/path/something.png',
      directory: '/path/'
   },
   other: {
      name: 'other',
      file: '/path/other.m4v',
      directory: '/path/'
   }
};

describe('MovieMap', function () {
   const MovieMap = rewire('../src/movie-map.js');
   let mm = null;
   let fs = null;
   let beforeEach = function () {
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
      beforeEach(beforeEach);
      it('should clear map', function () {
         mm.movies['something'] = 'something-else';
         expect(mm.movies).to.not.be.empty;
         mm.clear();
         expect(mm.movies).to.be.empty;
      })
   });
   describe('#addMovieFiles', function () {
      beforeEach(beforeEach);
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
      beforeEach(beforeEach);
      it('should add a movie file to the map, adding to existing entries', function () {
         mm.movies.should.equal({});
         mm.addMovieFile("/path/something.mpg");
         mm.movies.should.deep.equal({
            "something": {
               "name": "something",
               "file": "/path/something.mpg",
               "image": "/path/something.jpg",
               "directory": "/path/"
            }
         });
      });
      it('should not add non-movie files to the map', () => {
         beforeEach(beforeEach);
         mm.addMovieFile("/path/SomeThing.jpg");
         mm.movies.should.deep.equal({});
      });
      it('should preserve the case of the movie title in the name element but not in the key', function () {
         mm.addMovieFile("/path/Something.mpg");
         mm.movies.should.deep.equal({
            'something': {
               'name': 'Something',
               'file': '/path/Something.mpg',
               "directory": "/path/",
               "image": "/path/Something.jpg"
            }
         });
      })
   });
   describe('#getMovie', function () {
      beforeEach(beforeEach);
      it('should return a movie from the map if it has one for that id', function () {
         mm.addMovieFile("/path/something.mpg");
         mm.getMovie("something").should.deep.equal({
            'name': 'something', 'file': '/path/something.mpg', "directory": "/path/"
         });
      })
   });
   describe('#isMovieExtension', function () {
      beforeEach(beforeEach);
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
      beforeEach(beforeEach);
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
   describe('#setMovieProperties', function () {
      beforeEach(beforeEach);
      it('should set the named property for the specified movie id to the specified value', function () {
         mm.addMovieFile("/path/some.mpg");
         mm.movies['some'].id = 123;
         mm.movies['some'].id.should.equal(123);
         expect(mm.movies['some'].prop).to.be.undefined;
         mm.setMovieProperties(123, {'prop': 'propValue'});
         mm.movies['some'].prop.should.equal('propValue');
      })
   });
   describe('#keyify', function () {
      beforeEach(beforeEach);
      it('should make the provided string lower-case for use as a map key for the movie', function () {
         mm.keyify('BlAh').should.equal('blah');
      })
   });
   describe('#getMovieById', function () {
      beforeEach(beforeEach);
      it('should retrieve a movie object when given the id', function () {
         mm.movies['aaa'] = {id: 12, "name": "AAA"};
         mm.movies['alien'] = {id: 123, "name": "Alien"};
         mm.movies['bobo'] = {id: 234, "name": "BoBo"};
         mm.getMovieById(123).should.deep.equal({id: 123, "name": "Alien"});
      })
   });
   describe('#load', function () {
      beforeEach(beforeEach);
      it('should look for and load the file', function () {
         fs.readFileSync.withArgs(mm._persistentMapFileName).returns(JSON.stringify(fileListMapResult));
         fs.existsSync.withArgs(mm._persistentMapFileName).returns(true);
         fs.statSync.withArgs(mm._persistentMapFileName).returns({
            isFile: function () {
               return true;
            }
         });
         mm.load();
         mm.movies.should.deep.equal(fileListMapResult);
      });
      it('should not try to load when there is no map file', function () {
         fs.readFileSync.withArgs(mm._persistentMapFileName).throws;
         fs.existsSync.returns(false);
         fs.statSync.withArgs(mm._persistentMapFileName).returns({
            isFile: function () {
               return false;
            }
         });
         mm.load();
         mm.movies.should.deep.equal({});
      })
   });
   describe('#persist', function () {
      beforeEach(beforeEach);
      it('should try to save the current movie map to a file', function () {
         mockStream = {
            close: sinon.stub(),
            write: sinon.stub()
         };
         mockStream.write.returns(mockStream);
         fs.createWriteStream = sinon.stub();
         fs.createWriteStream.withArgs(mm._persistentMapFileName).returns(mockStream);
         mm.directory = "./";
         mm.movies = fileListMapResult;
         mm.persist();
         fs.createWriteStream.should.have.been.calledWith(mm._persistentMapFileName);
         mockStream.write.should.have.been.calledWith(JSON.stringify(fileListMapResult));
         mockStream.close.should.have.been.calledOnce;
      })
   })
});