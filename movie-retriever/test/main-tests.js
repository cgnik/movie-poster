/**
 * Created by christo on 9/5/15.
 */
let Main = require('../src/main.js');

describe('Main', function () {
    let MovieMap = sinon.createStubInstance(require('../src/movie-map.js'));
    let Indexer = sinon.createStubInstance(require('../src/indexer.js'));
    beforeEach(function () {
        main = new Main();
    })

    var main = null;
    describe('#initMoviedb', function () {
        it('should set the moviedb key from a file', function () {
            sinon.stub(fs, 'readFileSync').returns('blahblah');
            main.initMoviedb();
            fs.readFileSync.should.have.been.calledWith('themoviedb-key.txt');
            fs.readFileSync.restore();
        })
        it('should initialize from provided key and not the file', function () {
            sinon.stub(fs, 'readFileSync').returns('blahblah');
            main.themoviedbKey = "blahblah";
            main.initMoviedb();
            fs.readFileSync.should.have.not.been.calledWith('themoviedb-key.txt');
            fs.readFileSync.restore();
        })
    })
    describe('#initProcessArgs', function () {
        it('should make all -- arguments part of "this"', function () {
            props = ['node.command', 'script.myself', '--one=1', '--two=2'];
            main.initProcessArgs(props);
            main.one.should.equal('1');
            main.two.should.equal('2');
        })
        it('should make non-"--" arguments into main.dirs entries', function () {
            props = ['node.command', 'self.scriptline', '--one=maximum', "/some/dir/"];
            statSyncStub = sinon.stub(fs, 'statSync');
            statSyncStub.withArgs('/some/dir/').returns({
                isDirectory: function () {
                    return true;
                }
            });
            statSyncStub.withArgs('/some/dir/file.mpg').returns({
                isDirectory: function () {
                    return false;
                },
                isFile: function () {
                    return true;
                }
            })
            main.initProcessArgs(props);
            main.directories.should.deep.equal(['/some/dir/']);
        })
        it('should check all file and dir arguments to see if they exist', function () {
            params = ['/dir/that/definitely/does/not/exist'];
            expect(main.initProcessArgs.bind(main, params)).to.throw;
        })
    })
    describe('#process', function () {
        it('should initialize the indexer', function () {
            sinon.stub(fs, 'readFileSync').returns('blahblah');
            main.directories = ['./'];

            main.process();
            main.indexers['./'].should.exist;
            console.log(main.indexers['./']);
            fs.readFileSync.should.have.been.calledWith('themoviedb-key.txt');
            fs.readFileSync.restore();
        })
    })
})