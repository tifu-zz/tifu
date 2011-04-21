(function() {

    Object.merge = function(source, other) {
        return source.merge(other);
    };

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

    Object.prototype.chainMethod = function(method, intercept) {
      var obj = this;
      var chained = obj[method];
      var _super = function() {
        chained.apply(obj,arguments);
      };

      return function() {
        var args = Array.prototype.slice.call(arguments);
        args.unshift(_super);
        intercept.apply(obj,args);
      };
    };



})();