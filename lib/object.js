(function() {
    
    //________________________________________________________________________________________
    //Object Methods
	/*
	Object.create(prototypeObject)

	Desciption:
		Creates a new object based on the given prototype. From Crockford: (http://javascript.crockford.com/prototypal.html)
	Usage:
		newObject = Object.create(oldObject);
	*/
    Object.create = function (prototypeObject) {
        function F() {}
        F.prototype = prototypeObject;
        return new F();
    };

    Object.merge = function() {
        var args = Array.prototype.slice.call(arguments);
        args.unshift({});
        return Object.merge$.apply(null,args);
    };
    
    Object.merge$ = function() {
        function isNestedObject(obj) {
            return (obj !== null && 
                    obj !== undefined && 
                    typeof obj === 'object' && 
                    !(obj instanceof Array));
        }
        
        var args = Array.prototype.slice.call(arguments);
        var target = args[0];
        var source;
        
        for (var i=1,length=args.length; i<length; i++) {
            source = args[i];
            if (source) {
                for (var property in source) {
                    if (source.hasOwnProperty(property)) {
                        if (isNestedObject(target[property]) && isNestedObject(source[property])) {
                            target[property] = Object.merge(target[property],source[property]);
                        } else {
                            target[property] = source[property];
                        }
                    }
                }
            }
        }
        return target;
    };
    
	Object.chainMethod = function(obj, method, intercept) {
        var chained = obj[method];
        var _super = function() {
            return chained.apply(obj,arguments);
        };

        return function() {
            var args = Array.prototype.slice.call(arguments);
            args.unshift(_super);
            return intercept.apply(obj,args);
        };
    };
    
    Object.forEachOwnProperty = function(object, lambda) {
	    for (var propName in object) {
            if (object.hasOwnProperty(propName)) {
                lambda.apply(object, [propName]);
            }
        }	
	};

	Object.stripFunctions = function(object) {
        // for (var propName in object) {
        //             if(typeof object[propName] === 'function') {
        //                 object[propName] = undefined;
        //             }
        //         }    
	    return object;
	};
	
    //________________________________________________________________________________________
    //Prototype Methods
    Object.prototype.merge$ = function(options) {
        // Ti.API.warn('Object.prototype.merge$ is deprecated. Use Object.merge$() in the future.');
        return Object.merge$(this,options);
    };
    
    Object.prototype.merge = function(options) {
        // Ti.API.warn('Object.prototype.merge is deprecated. Use Object.merge() in the future.');
        return Object.merge(this,options);
    };
    
})();