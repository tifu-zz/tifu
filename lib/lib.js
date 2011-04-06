fu.lib = (function() {
    return {
        undefinedOr:function(obj1, obj2) {
            return (obj1 === undefined) ? obj2 : obj1;
        }
    }
})();