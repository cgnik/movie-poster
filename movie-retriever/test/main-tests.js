/**
 * Created by christo on 9/5/15.
 */
Main = require('../src/main.js');
MovieMap = require('../src/main.js');
Indexer = require('../src/indexer.js');

describe('Main', function () {
    var main = null;
    describe('#initProcessArgs', function () {
        beforeEach(function () {
            main = new Main();
            main.movieMap = sinon.mock(MovieMap.prototype);
        })
        it('should make all -- arguments part of "this"', function () {
            props = ['node.command', 'script.myself', '--one=1', '--two=2'];
            main.initProcessArgs(props);
            main.one.should.equal('1');
            main.two.should.equal('2');
        })
        it('should make non-"--" arguments into a movie map', function () {
            main.movieMap.expects('initialize').once().withExactArgs('/some/dir/');
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
        beforeEach(function () {
            main = new Main();
            main.indexer = sinon.mock(main.indexer.constructor.prototype);
            main.indexer.setUp = sinon.stub();
            main.indexer.enqueueMissingIds = sinon.stub();
        })
        it('should initialize the indexer', function () {
            main.process();
            main.indexer.setUp.calledOnce.should.be.true;
            main.indexer.enqueueMissingIds.calledOnce.should.be.true;
        })
    })
})