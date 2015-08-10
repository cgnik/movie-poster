var testConfig = {testConfig: '1'};
describe('MovieDbQueue', function () {
    var mockMoviedb = module.require("moviedb")('test-moviedb-key');
    queue = require('../src/moviedb-queue.js')({moviedb: mockMoviedb});
    beforeEach(function () {
        sinon.stub(mockMoviedb, 'configuration').yields(testConfig);
    })
    afterEach(function () {
        mockMoviedb.configuration.restore();
    })
    describe('#configure', function (done) {
        it('call moviedb get configuration', function () {
            queue.configure(function (err, config) {
                expect(config).to.equal(testConfig);
                done();
            })
        })
    })
})