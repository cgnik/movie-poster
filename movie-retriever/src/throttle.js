/**
 * Created by christo on 8/15/15.
 */
rateLimit = require("rate-limit");

var Throttle = function (params) {
    var self = ({
        init: function (params) {
            var rateInterval = params.rateInterval ? params.rateInterval : 500;
            log.info("Initializing rate limit queue");
            self.queue = rateLimit.createQueue({
                interval: rateInterval
            });
        },
        add: function (callable) {
            queue.add(callable);
        }
    });
    merge(self, params);
};

module.exports = Throttle;