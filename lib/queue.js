(function() {
    fu.lib.createQueue = function(process) {
        var queue = {object:null};
        var stack = [];
        var running = false;

        queue.push = function(object) {
            stack.push(object);
            if (stack.length===1 && !running) {
                running = true;
                queue.pull();
            }
        };

        queue.pull = function() {
            if (stack.length > 0) {
                queue.object = stack.shift();
                try {
                    process(queue.object);
                } catch(e) {
                    Ti.API.warn('Exception raised in queue processing. '+
                                 'Try to ensure that exceptions are handled within your queue items.\n'+
                                 'Exception was:\n'+e);
                }
            } else {
                queue.object = null;
                running = false;
            }
        };
        
        return queue;
    };
})();