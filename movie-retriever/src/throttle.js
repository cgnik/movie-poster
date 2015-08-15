/**
 * Created by christo on 8/15/15.
 */
rateLimit = require("rate-limit");

var Throttle = function (params) {
    var self = ({
        init: function (params) {
// speed at which we process the queue in ms
            var rateInterval = params.rateInterval ? params.rateInterval : 500;
            if (self.queue == undefined) {
                log.info("Initializing rate limit queue");
                self.queue = rateLimit.createQueue({
                    interval: rateInterval
                });
            }
        }
    });
    merge(self, params);
};

module.exports = Throttle;