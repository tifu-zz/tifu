fu.lib.logger = (function() {
    var isSim = (Ti.Platform.model === "Simulator");
    var logLevel = null;
    var kLoggingLevel = {
        none:  0,
        error: 1,
        warn:  2,
        info:  3,
        debug: 4,
        all:   5
    };

    function getLogLevel() {
        if (logLevel == null) {
            if (isSim) {
                logLevel = getLevelValue(fu.config.logger.simulatorLoggingLevel);
            } else {
                logLevel = getLevelValue(fu.config.logger.deviceLoggingLevel);
            }
        }
        return logLevel;
    }

    function getLevelValue(level) {
        var value = (level) ? kLoggingLevel[level.toLowerCase()] : null;
        if (value == null) {
            value = kLoggingLevel.all;
        }
        return value;
    }

    function levelEnabled(level) {
        return (getLogLevel() >= level);
    }

    return {
        fu:function(message) {
            if (levelEnabled(kLoggingLevel.all)) {
                Ti.API.log('FU',message);
            }
        },
        debug:function(message) {
            if (levelEnabled(kLoggingLevel.debug)) {
                 Ti.API.debug(message);
             }
        },
        trace:function(message) {
            if (levelEnabled(kLoggingLevel.debug)) {
                Ti.API.trace(message);
            }
        },
        info:function(message) {
            if (levelEnabled(kLoggingLevel.info)) {
                Ti.API.info(message);
            }
        },
        notice:function(message) {
            if (levelEnabled(kLoggingLevel.info)) {
                Ti.API.notice(message);
            }
        },
        timestamp:function(message) {
            if (levelEnabled(kLoggingLevel.info)) {
                Ti.API.timestamp(message);
            }
        },
        warn:function(message) {
            if (levelEnabled(kLoggingLevel.warn)) {
                Ti.API.warn(message);
            }
        },
        error:function(message) {
            if (levelEnabled(kLoggingLevel.error)) {
                Ti.API.error(message);
            }
        },
        critical:function(message) {
            if (levelEnabled(kLoggingLevel.error)) {
                Ti.API.critical(message);
            }
        },
        log:function(level,message) {
            var levelValue = getLevelValue(level);
            if (levelEnabled(levelValue)) {
                Ti.API.log(level,message);
            }
        }
    };

})();