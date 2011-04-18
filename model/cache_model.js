fu.model.cache = (function() {
    var cache = {
		logEnabled:false
	};
	
	var log = function(message) {
		if(cache.logEnabled) {
			Ti.API.info(message);
		}
	};

    cache.set = function(key, value, mins) {
        var d = new Date();
        var expireTime = d.getTime() + (1000 * 60 * mins);
        var data = {'expire':expireTime,'json':value};
        log("SETTING with expireTime = " + expireTime);
        log('SETTING ' + key + ' in cache for mins = ' + mins);
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
            log("expireTime = " + expireTime);
            log("nowMS = " + nowMS);

            log('GETTING ' + key + ' from cache remaining mins = ' + ((expireTime - nowMS) / 60000));
            return obj;
        }
        else {
            log(key + ' NOT found in cache');
            return null;
        }
    };

    cache.remove = function(key) {
        log('REMOVING ' + key + ' from cache');
        Titanium.App.Properties.removeProperty(key);
    };

    cache.removeAll = function() {
        log('REMOVING ALL');
        var props = Titanium.App.Properties.listProperties();
        for (var c = 0; c < props.length; c++) {
            cache.remove(props[c]);
        }
    };

    cache.clean = function() {
        log('CLEAN');
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
