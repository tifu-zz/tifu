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
                queue.object = stack.shift();
                process(queue.object);
            }
        }
        
        return queue;
    }
})();