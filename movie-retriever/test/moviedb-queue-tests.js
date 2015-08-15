var testConfig = {testConfig: '1'};
describe('MovieDbQueue', function () {
    var mockMoviedb = module.require("moviedb")('test-moviedb-key');
    var queue = require('../src/moviedb-queue.js')({moviedb: mockMoviedb});
    beforeEach(function () {
        sinon.stub(mockMoviedb, 'configuration').callsArgWith(1, null, testConfig);
    })
    afterEach(function () {
        mockMoviedb.configuration.restore();
    })
    describe('#configure', function (done) {
        it('call moviedb get configuration', function (done) {
            setTimeout(function () {
                queue.configure(function (config) {
                    expect(config).to.equal(testConfig);
                    done();
                })
            }, TIMEOUT);
        })
    })
})