fu.model.cache = (function() {
    var cache = {};

    cache.set = function(key, value, mins) {
        var d = new Date();
        var expireTime = d.getTime() + (1000 * 60 * mins);
        var data = {'expire':expireTime,'json':value};
        Ti.API.info("SETTING with expireTime = " + expireTime);
        Titanium.API.info('SETTING ' + key + ' in cache for mins = ' + mins);
        Titanium.App.Properties.setString(key, JSON.stringify(data));
    };

    cache.get = function(key) {
        var val = Titanium.App.Properties.getString(key);
        if (val) {
            var now = new Date();
            var nowMS = now.getTime();
            var data = JSON.parse(val);
            var obj = data.json;
            var expireTime = data.expire;
            if (nowMS > expireTime) {
                cache.remove(key);
                return null;
            }
            Ti.API.info("expireTime = " + expireTime);
            Ti.API.info("nowMS = " + nowMS);

            Titanium.API.info('GETTING ' + key + ' from cache remaining mins = ' + ((expireTime - nowMS) / 60000));
            return obj;
        }
        else {
            Titanium.API.info(key + ' NOT found in cache');
            return null;
        }
    };

    cache.remove = function(key) {
        Titanium.API.info('REMOVING ' + key + ' from cache');
        Titanium.App.Properties.removeProperty(key);
    }

    cache.removeAll = function() {
        Titanium.API.info('REMOVING ALL');
        var props = Titanium.App.Properties.listProperties();
        for (var c = 0; c < props.length; c++) {
            cache.remove(props[c]);
        }
    }

    cache.clean = function() {
        Titanium.API.info('CLEAN');
        var props = Titanium.App.Properties.listProperties();
        for (var c = 0; c < props.length; c++) {
            var value = Titanium.App.Properties.getString(props[c]);
            if (value != null) {
                var nowMS = now.getTime();
                var data = JSON.parse(value);
                var obj = data.json;
                var expireTime = data.expire;
                if (nowMS > expireTime) {
                    cache.remove(props[c]);
                }
            }
        }
    };

    return cache;
})();
