/**
 * Created by christo on 9/5/15.
 */

describe('Main', function () {
    beforeEach(function () {
        main = require('../src/main.js');
        main.index = sinon.mock();
    })
    describe('#initProcessArgs', function () {
        it('should make all -- arguments part of "this"', function () {
            props = ['--one=1', '--two=2'];
            main.initProcessArgs(props);
            main.one.should.equal('1');
            main.two.should.equal('2');
        })
        it('should make all non- arguments into additions to the movieMap', function () {
            props = ['--one=maximum', "/some/dir/", "/some/dir/file.mpg"];
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
            main.index.movieMap.addMovieDirectory.should.have.been.called;
            main.index.movieMap.addMovieDirectory.restore();
        })
        it('should check all file and dir arguments to see if they exist', function () {
            params = ['/dir/that/definitely/does/not/exist'];
            expect(main.initProcessArgs.bind(main, params)).to.throw();
        })
    })
})