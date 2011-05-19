fu.lib = (function() {

    function getVersion() {
        if (Ti.Platform.name == 'iPhone OS') {
            var version = Ti.Platform.version.split("."),
                    majorVersion = parseInt(version[0], 10),
                    minorVersion = parseInt(version[1], 10);

            return {major:majorVersion, minor:minorVersion};
        }
        return null;
    }

    return {
        defined:function(obj1, obj2) {
            return (obj1 === undefined) ? obj2 : obj1;
        },
        isiOS3_2Plus:function() {
            var version = getVersion();
            if (version && ( version.major > 3 || (version.major == 3 && version.minor > 1) )) {
                return true;
            }
            return false;
        },
        isiOS4Plus:function() {
            var version = getVersion();
            if (version && version.major >= 4) {
                return true;
            }
            return false;
        }
    };
})();

Ti.include(
    '/tifu/lib/queue.js',
    '/tifu/lib/object.js',
    '/tifu/lib/cache.js',
    '/tifu/lib/http.js'
);