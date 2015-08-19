describe("Throttle", function () {
    var throttle = require('../src/throttle.js');
    throttle.initialize();
    describe('initialize', function () {
        it('should initialize the queue', function () {
            expect(throttle.queue).not.be.empty;
            expect(throttle.queue).not.equal(undefined);
        })
        it('should have a default interval of 500', function () {
            expect(throttle.interval).equal(500);
        })
        it('should accept my rate interval on initialize', function () {
            throttle.initialize({interval: 200});
            expect(throttle.interval).equal(200);
        })
        it('should call my callback within the interval', function (done) {
            setTimeout(function () {
                throttle.add(function () {
                    done();
                });
            }, throttle.interval);
        })
    })
})