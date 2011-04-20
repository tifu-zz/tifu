fu.model.http = (function() {

    var xhr = Ti.Network.createHTTPClient({
        timeout:60000,
        enableKeepAlive:false
    });

    var http = {
        xhr:xhr,
        defaultExpire:60,
        defaultUseCache:false,
        defaultFormat:'text', // json, xml, text, or none
		logEnabled:false
    };
    var accept = {
        json:'application/json; charset=utf-8',
        xml:'application/xml; charset=utf-8',
        text:'text/plain; charset=utf-8'
    };
    var contentType = {
        json:'application/json; charset=utf-8',
        xml:'application/xml',
        formUrlencoded:'application/x-www-form-urlencoded'
    };

    var queue = fu.lib.createQueue(
            function send(params) {
                var data = formatData(params.format, params.data);
                http.json = null;
                http.xml = null;
                http.data = null;
                http.text = null;
                http.status = null;
                http.fromCache = false;
                http.params = params;

                xhr.open(params.method, params.url);
                var headers = params.requestHeaders || {};
                for (var header in headers) {
                    if (headers.hasOwnProperty(header)) {
                        xhr.setRequestHeader(header, headers[header]);
                    }
                }
                xhr.send(data);
            }
    );

    xhr.onload = function() {
        http.status = xhr.status;
        onload(xhr);
        queue.pull();
    };

    xhr.onerror = function(e) {
        http.status = xhr.status;
        handleOtherResponse(xhr);
        if (http.failure) {
            try {
                http.failure(e);
            } catch(err) {
                warnAboutException(err);
            }
        }
        queue.pull();
    };

    var onload = function(response) {
        handleResponse(response);
        complete();
    };

    var complete = function() {
        if (http.complete) {
            try {
                http.complete();
            } catch (err) {
                warnAboutException(err);
            }
        }
    };

    var handleResponse = function(response) {
        var params = http.params;
        var format = params.format;
        if (format === 'json') {
            handleJsonResponse(response.responseText);
        } else if (format === 'xml') {
            handleXmlResponse(response.responseText);
        } else if (format === 'text') {
            handleTextResponse(response.responseText);
        } else if (format === 'data') {
            handleDataResponse(response.responseData);
        } else {
            handleOtherResponse(response);
        }
    };

    var handleTextResponse = function(textString) {
        http.text = textString;
        cacheIfGetOk(textString);
    };

    var handleJsonResponse = function(jsonString) {
        log("!!onload json = " + jsonString);
        if (jsonString != null && jsonString.trim() != "") {
            http.json = JSON.parse(jsonString);
            cacheIfGetOk(jsonString);
        }
    };

    var handleXmlResponse = function(xmlString) {
        http.xml = Ti.XML.parseString(xmlString);
        cacheIfGetOk(xmlString);
    };

    var handleDataResponse = function(data) {
        if (data != null) {
            http.data = data;
            cacheIfGetOk(data);
        }
    };

    var handleOtherResponse = function(response) {
        http.xml = response.responseXML;
        http.text = response.responseText;
        http.data = response.responseData;
    };

    var cacheIfGetOk = function(value) {
        var params = http.params;
        var status = http.status;
        if (!http.fromCache && params.method === "GET" && status >= 200 && status <= 299) {
            fu.model.cache.set(params.url, JSON.stringify(http), params.expire);
        }
    };

    var send = function(params) {
        log('http_model.send()');
        queue.push(params);
    };
    
    var setRequestHeader = function(params, key, value) {
        if (params.requestHeaders == null) {
            params.requestHeaders = {};
        }
        params.requestHeaders[key] = value;
    };

    var appendContentTypeHeader = function(params) {
        var format = params.format,
            headerValue;
        if (format === 'json') {
            headerValue = contentType.json;
        } else if (format === 'xml') {
            headerValue = contentType.xml;
        } else if (format === 'text') {
            headerValue = contentType.formUrlencoded;
        }
        setRequestHeader(params, 'Content-Type', headerValue);
    };

    var appendAcceptHeader = function(params) {
        var format = params.format,
            headerValue;
        if (format === 'json') {
            headerValue = accept.json;
        } else if (format === 'xml') {
            headerValue = accept.xml;
        } else if (format === 'text') {
            headerValue = accept.text;
        }
        setRequestHeader(params, 'Accept', headerValue);
    };

	var log = function(message) {
		if(http.logEnabled) {
			Ti.API.info(message);
		}
	};

    var warnAboutException = function(err) {
        Ti.API.warn('Exception raised in callback. '+
                    'Try to ensure that exceptions are handled within your callback.\n'+
                    'Exception was:\n'+JSON.stringify(err));
    };

    var formatData = function(format, data) {
        if (typeof data === 'string') {
            return data;
        }
        if (format === 'json') {
            return JSON.stringify(data);
        }
        return data;
    };

    var applyDefaults = function(params) {
        params.format = fu.lib.defined(params.format, http.defaultFormat);
        params.useCache = fu.lib.defined(params.useCache, http.defaultUseCache);
        params.expire = fu.lib.defined(params.expire, http.defaultExpire);
    };

    http.get = function(params) {
        applyDefaults(params);
        appendAcceptHeader(params);
        params.method = "GET";
        var useCache = params.useCache;
        log('http_model.get(' + JSON.stringify(params) + ')');
        log("!!!!!! use cache = " + useCache);
        if (useCache) {
            var cachedHttp = JSON.parse(fu.model.cache.get(params.url));
            if (cachedHttp) {
                //log("cachedHttp = "+JSON.stringify(cachedHttp));
                http.json = cachedHttp.json;
                http.xml = cachedHttp.xml;
                http.data = cachedHttp.data;
                http.text = cachedHttp.text;
                http.status = cachedHttp.status;
                http.fromCache = true;
                http.params = params;
                complete();
            } else {
                send(params);
            }
        } else {
            send(params);
        }
    };

    http.post = function(params) {
        applyDefaults(params);
        params.method = "POST";
        appendAcceptHeader(params);
        appendContentTypeHeader(params);
        log('http_model.post(' + JSON.stringify(params) + ')');
        send(params);
    };

    return http;
})();