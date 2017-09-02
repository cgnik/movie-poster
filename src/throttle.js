/**
 * Created by christo on 8/15/15.
 */
let RateLimit = require("rate-limit");

class Throttle {
    constructor() {
        this.interval = 500;
        this.initialize();
    }

    initialize(params) {
        this.interval = (params && params.interval) || this.interval;
        this.queue = RateLimit.createQueue({
            interval: this.interval
        });
        return this;
    }

    add(callable) {
        if (typeof callable === 'undefined') {
            throw new Error("Cannot specify a null callable to add to the queue");
        }
        this.queue.add(callable);
    }
}
module.exports = Throttle;