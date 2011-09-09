fu.lib.createHttp = function(opts) {
    
    var http = {};
    var cache = fu.lib.createCache('tifu_http',opts.cacheOptions);
    var options = Object.merge(fu.config.http,opts.httpOptions);

    http.get = function(params) {
        params.method = 'GET';
        var cachedResponse = getFromCache(params);
        if (cachedResponse) {
            cachedResponse.fromCache = true;
            complete(cachedResponse,params);
        } else {
            sendGet(params);
        }
    };

    http.post = function(params) {
        params.method = 'POST';
        send(params);
    };
    
    http.destroy = function(params) {
        params.method = 'DELETE';
        send(params);
    };

    http.put = function(params) {
        params.method = 'PUT';
        send(params);
    };

    http.resetCache = function() {
        cache.reset();
    };
    
    http.expireCache = function() {
        cache.expire();
    };

    var getFromCache = function(params) {
        var useCache = params.useCache;
        if (useCache) {
            var key = cacheKey(params.url, params.cacheLabel);
            var cachedResponse = cache.get(key);
            return cachedResponse;
        }
        return null;
    };

    var sendGet = function(params) {
        send(params, 'GET');
        // Just in case the database blocks...
        cache.remove(params.url + '_*');
    };

    var send = function(params) {
        params = Object.merge(options, params || {});
        //Ti.API.info("merged params = "+JSON.stringify(params));
        var xhr = Ti.Network.createHTTPClient({
            timeout:params.timeout,
            enableKeepAlive:params.enableKeepAlive,
            onload:function() {
                onload(xhr, params);
            },
            onerror:function(e) {
                onerror(xhr, params, e);
            }
        });

        xhr.open(params.method, params.url);
        applyHeaders(xhr, params);
        //Ti.API.info("Sending url = "+params.url);
        xhr.send(params.data);
    };

    var applyHeaders = function(xhr, params) {
        var headers = params.requestHeaders || {};
        for (var header in headers) {
            if (headers.hasOwnProperty(header)) {
                xhr.setRequestHeader(header, headers[header]);
            }
        }
    };

    var buildResponse = function(xhr, params) {
        return {
			params:params,
            status:xhr.status,
            headers:xhr.responseHeaders,
            text:xhr.responseText,
            data:xhr.responseData,
            fromCache:false
        };
    };

    var onload = function(xhr, params) {
        var response = buildResponse(xhr, params);
        cacheIfGetOk(response, params);
        complete(response, params);
    };

    var onerror = function(xhr, params, e) {
        var response = buildResponse(xhr, params);
        response.error = e;
        if (params.failure) {
            try {
                params.failure(response);
            } catch(err) {
                warnAboutException(err);
            }
        }
    };

    var cacheIfGetOk = function(response, params) {
        var status = response.status;
        if (params.method === "GET" && status >= 200 && status <= 299) {
            var key = cacheKey(params.url, params.cacheLabel);
            cache.put(key, response, params.cacheExpire);
        }
    };

    var complete = function(response, params) {
        if (params.complete) {
            try {
                params.complete(response);
            } catch (err) {
                warnAboutException(err);
            }
        }
    };

    var warnAboutException = function(err) {
        Ti.API.warn('Exception raised in callback. ' +
                'Try to ensure that exceptions are handled within your callback.\n' +
                'Exception was:\n' + JSON.stringify(err));
    };

    var cacheKey = function(url, label) {
        return (label != null) ? url + '_(' + label + ')' : url;
    };

    return http;

};