(function() {
    fu.lib.createQueue = function(process) {
        var queue = {object:null};
        var stack = [];

        queue.push = function(object) {
            stack.push(object);
            if (stack.length===1) {
                queue.pull();
            }
        };

        queue.pull = function() {
            if (stack.length > 0) {
                queue.object = stack[0];
                try {
                    process(queue.object);
                } catch(e) {
                    Ti.API.error('Exception raised in queue processing. '+
                                 'Try to ensure that exceptions are handled within your queue items.\n'+
                                 'Exception was:\n'+e);
                }
                stack.shift();
            }
        };
        
        return queue;
    };
})();