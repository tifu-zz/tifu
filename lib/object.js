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

    Object.merge = function(source, other) {
        return source.merge(other);
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
        function isNestedObject(obj) {
            return (obj !== null && 
                    obj !== undefined && 
                    typeof obj === 'object' && 
                    !(obj instanceof Array));
        }
        if (options) {
            for (var property in options) {
                if (options.hasOwnProperty(property)) {
                    if (isNestedObject(this[property]) && isNestedObject(options[property])) {
                        this[property] = this[property].merge(options[property]);
                    } else {
                        this[property] = options[property];
                    }
                }
            }
        }
		return this;
    };
    
    Object.prototype.merge = function(options) {
        var newObject = {};
        for (var property in this) {
            if (this.hasOwnProperty(property)) {
                newObject[property] = this[property];
            }
        }
        newObject.merge$(options);
        return newObject;
    };

})();