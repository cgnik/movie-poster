/**
 * Created by christo on 8/15/15.
 */

describe('main', function () {
    main = require('../src/main.js');
    describe('#initMoviedb', function () {
        it('should set the moviedb key from a file', function () {
            sinon.stub(fs, 'readFileSync').returns('blahblah');
            main().initMoviedb();
            fs.readFileSync.should.have.been.calledWith('themoviedb-key.txt');
            fs.readFileSync.restore();
        })
        it('should initialize from provided key and not the file', function () {
            main = require('../src/main.js');
            sinon.stub(fs, 'readFileSync').returns('blahblah');
            var m = main();
            m.themoviedbKey = "blahblah";
            m.initMoviedb();
            fs.readFileSync.should.have.not.been.calledWith('themoviedb-key.txt');
            fs.readFileSync.restore();
        })
    })
    describe('#initMovieIds', function () {
        it('should load existing movie ids from a file', function () {
            sinon.stub(fs, 'readFileSync').withArgs('movie-ids.json').returns('{"aliens" : 679}');
            sinon.stub(fs, 'existsSync').withArgs('movie-ids.json').returns(true);
            m = main();
            m.initMovieIds();
            expect(m.movieIds['aliens']).to.equal(679);
            fs.readFileSync.should.have.been.calledWith('movie-ids.json');
            fs.readFileSync.restore();
            fs.existsSync.restore();
        })
    })
})