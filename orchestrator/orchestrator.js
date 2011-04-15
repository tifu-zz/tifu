fu.orchestrator = (function() {
    
    function initNamespace(namespace) {
        var key, member;
        if (namespace) {
            for (key in namespace) {
                if (namespace.hasOwnProperty(key)) {
                    member = namespace[key];
                    if (member.init && typeof(member.init) === 'function') {
                        member.init();
                    }
                }
            }
        }
    }
    
    return {
        init:function() {
            for (var i=0,length=arguments.length; i<length; i++) {
                initNamespace(arguments[i].model);
                initNamespace(arguments[i].presenter);
            }
        }
    };
})();