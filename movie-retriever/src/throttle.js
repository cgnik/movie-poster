/**
 * Created by christo on 8/15/15.
 */
rateLimit = require("rate-limit");

function Throttle() {
    this.interval = 500;
};
Throttle.prototype.initialize = function (params) {
    if (params) {
        merge(this, params);
    }
    this.queue = rateLimit.createQueue({
        interval: this.interval
    });
    return this;
};
Throttle.prototype.add = function (callable) {
    if( typeof callable === 'undefined') {
        throw new Error("Cannot specify a null callable to add to the queue");
    }
    this.queue.add(callable);
};

module.exports = new Throttle().initialize();