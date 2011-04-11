fu.lib = (function() {
    return {
        defined:function(obj1, obj2) {
            return (obj1 === undefined) ? obj2 : obj1;
        }
    };
})();

Ti.include(
    'tifu/lib/queue.js'
);