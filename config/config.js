// fu.config defines default component behaviors
// components should allow overrides of these settings at creation time
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
        sweepIntervalSeconds:null
    };

    return config;
})();