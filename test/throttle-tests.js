var Throttle = require('../src/throttle.js');

describe("Throttle", function () {
    describe('#initialize', function () {
        it('should initialize the queue', function () {
            let throttle = new Throttle();
            throttle.queue.should.exist;
        });
        it('should have a default interval of 500', function () {
            let throttle = new Throttle();
            expect(throttle.interval).equal(500);
        });
        it('should accept my rate interval on initialize', function () {
            let throttle = new Throttle();
            throttle.initialize({interval: 200});
            expect(throttle.interval).equal(200);
        })
    });
    describe('#add', function () {
        it('should call my callback within the interval', function (done) {
            let throttle = new Throttle();
            setTimeout(function () {
                throttle.add(function () {
                    done();
                });
            }, throttle.interval);
        });
        it('should throw when a null callable is specified', function () {
            let throttle = new Throttle();
            expect(throttle.add.bind(throttle, [null])).to.throw;
        })
    })
});