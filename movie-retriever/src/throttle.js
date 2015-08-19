/**
 * Created by christo on 8/15/15.
 */
rateLimit = require("rate-limit");

var Throttle = function () {
    var self = ({
        initialize: function (params) {
            self.interval = 500;
            if (params) {
                merge(self, params);
            }
            self.queue = rateLimit.createQueue({
                interval: self.interval
            });
            return self;
        },
        add: function (callable) {
            self.queue.add(callable);
        },
    });
    return self.initialize();
};

module.exports = Throttle();