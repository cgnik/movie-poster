/**
 * Created by christo on 9/5/15.
 */
let Indexer = sinon.mock(MoviePoster.Indexer);
let MovieSource = sinon.mock(MoviePoster.MovieDbMovieDb);
let Main = MoviePoster.Main;

describe('Main', function () {

    var main = null;
    beforeEach(function () {
        main = new Main();
    });
    describe('#initMoviedb', function () {
        it('should set the moviedb key from a file', function () {
            sinon.stub(fs, 'readFileSync').returns('blahblah');
            main.initMoviedb();
            fs.readFileSync.should.have.been.calledWith('themoviedb-key.txt');
            fs.readFileSync.restore();
        });
        it('should initialize from provided key and not the file', function () {
            sinon.stub(fs, 'readFileSync').returns('blahblah');
            main.themoviedbKey = "blahblah";
            main.initMoviedb();
            fs.readFileSync.should.have.not.been.calledWith('themoviedb-key.txt');
            fs.readFileSync.restore();
        })
    });

    describe('#process', function () {
        it('should initialize the indexer and moviedb', function () {
            sinon.stub(fs, 'readFileSync').returns('blahblah');

            main.directories = ['./'];
            main.process();
            main.indexers['./'].should.exist;
            console.log(main.indexers['./'].initialize);
            // FIXME: the following line doesn't work because can't seem to stub the return from the Indexer.constructor so that it
            // still has stubbed methods from Indexer
            // main.indexers['./'].initialize.should.have.been.calledOnce;
            fs.readFileSync.should.have.been.calledWith('themoviedb-key.txt');
            fs.readFileSync.restore();
        })
    })
});