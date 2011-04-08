fu.model.http = (function() {

    var xhr = Ti.Network.createHTTPClient({
        timeout:60000,
        enableKeepAlive:false
    });

    var http = {
        xhr:xhr,
        defaultExpire:60,
        defaultUseCache:false,
        defaultFormat:'text'
    };

    var queue = fu.lib.createQueue(
        function send(params) {
            http.json = null;
            http.xml = null;
            http.status = null;
            http.fromCache = false;
            http.params = params;

            xhr.open(params.method, params.url);
            xhr.send(params.data);
        }
    );

    xhr.onload = function() {
        http.status = xhr.status;
        onload(xhr.responseText);
        queue.pull();
    }

    xhr.onerror = function(e) {
        if (http.failure) {
            http.failure(e);
        }
        queue.pull();
    };

    var onload = function(responseString) {
        handleResponse(responseString);
        if (http.complete) {
            http.complete();
        }
    }

    var handleResponse = function(responseString) {
        var params = http.params;
        var format = fu.lib.defined(params.format, http.defaultFormat);
        if (format === 'json') {
            handleJsonResponse(responseString);
        } else if (format === 'xml') {
            handleXmlResponse(responseString);
        } else if (format === 'text') {
            handleTextResponse(responseString);
        }
    }

    var handleTextResponse = function(textString) {
        http.text = textString;
        cacheIfGetOk(textString);
    }

    var handleJsonResponse = function(jsonString) {
        Ti.API.info("!!onload json = " + jsonString);
        if (jsonString != null && jsonString.trim() != "") {
            http.json = JSON.parse(jsonString);
            cacheIfGetOk(jsonString);
        }
    };

    var handleXmlResponse = function(xmlString) {
        http.xml = Ti.XML.parseString(xmlString);
        cacheIfGetOk(xmlString);
    };

    var cacheIfGetOk = function(value) {
        var params = http.params;
        var status = http.status;
        if (!http.fromCache && params.method === "GET" && status >= 200 && status <= 299) {
            fu.model.cache.set(params.url, value, fu.lib.defined(params.expire, http.defaultExpire));
        }
    };

    var send = function(params) {
        queue.push(params);
    };

    http.get = function(params) {
        Ti.API.info("xhr.get");
        params.method = "GET";
        var useCache = fu.lib.defined(params.useCache, http.defaultUseCache);
        Ti.API.info("!!!!!! use cache = "+useCache);
        if (useCache) {
            var cachedData = fu.model.cache.get(params.url);
            if (cachedData) {
                http.status = 200;
                http.params = params;
                http.fromCache = true;
                onload(cachedData);
            } else {
                send(params);
            }
        } else {
            send(params);
        }
    };

    http.post = function(params) {
        params.method = "POST";
        send(params);
    };

    return http;
})();