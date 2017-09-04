/**
 * Created by christo on 9/5/15.
 */

let Main = rewire('../src/main');
describe('Main', () => {
   let main = null;
   let fs = null;
   let mockIndexer = null, mockSource = null;
   beforeEach(function () {
      main = null;
      fs = {
         readFileSync: sinon.stub()
      };
      mockIndexer = function () {
         return {initialize: sinon.stub(), process: sinon.stub()}
      };
      mockSource = sinon.stub().returns({});
      Main.__set__('fs', fs);
      Main.__set__('Indexer', mockIndexer);
      Main.__set__('MovieSource', mockSource);
   });
   describe('#initMoviedb', () => {
      it('should set the moviedb key from a file', () => {
         main = new Main();
         main.initMoviedb();
         fs.readFileSync.should.have.been.calledWith('themoviedb-key.txt');

      });
      it('should initialize from provided key and not the file', () => {
         main = new Main({'themoviedbKey': 'blahblah'});
         main.initMoviedb();
         fs.readFileSync.should.have.not.been.calledWith('themoviedb-key.txt');
      })
   });

   describe('#process', () => {
      it('should initialize the indexer and moviedb', (done) => {
         main = new Main();
         fs.readFileSync.returns('blahblah')
         main.directories = ['./'];
         main.process().then(results => {
            main.indexers['./'].should.exist;
            fs.readFileSync.should.have.been.calledWith('themoviedb-key.txt');
            mockSource.should.have.been.calledWith({'themoviedbKey': 'blahblah'});
            done();
         }).catch(e => done(e));
      })
   })
});