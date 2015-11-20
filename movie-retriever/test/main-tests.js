/**
 * Created by christo on 9/5/15.
 */
Main = require('../src/main.js');

describe('Main', function () {
    beforeEach(function () {
        main = new Main();
        main.index = sinon.mock();
    })
    describe('#initProcessArgs', function () {
        it('should make all -- arguments part of "this"', function () {
            main.reset
            props = ['--one=1', '--two=2'];
            main.initProcessArgs(props);
            main.one.should.equal('1');
            main.two.should.equal('2');
        })
        it('should make non-"--" arguments into a movie map', function () {
            props = ['--one=maximum', "/some/dir/"];
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
            main.movieMap.directory.should.equal('/some/dir/');
        })
        it('should check all file and dir arguments to see if they exist', function () {
            params = ['/dir/that/definitely/does/not/exist'];
            expect(main.initProcessArgs.bind(main, params)).to.throw();
        })
    })
})