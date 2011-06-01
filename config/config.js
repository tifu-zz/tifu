fu.config = (function() {
    var config = {};

    config.http = {
        cacheExpire:600,
        useCache:false,
        timeout:60000,
        enableKeepAlive:false
    };

    config.cache = {
        logEnabled:true,
        expirationSeconds:600,
        sweepIntervalSeconds:60
    };

    return config;
})();