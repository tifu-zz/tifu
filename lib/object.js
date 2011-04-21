(function() {

    // shallow-copy merge
    Object.merge = function(source, other) {
        var newObject = {};
        for (var property in source) {
            if (source.hasOwnProperty(property)) {
                newObject[property] = source[property];
            }
        }
        if (other) {
            for (property in other) {
                if (other.hasOwnProperty(property)) {
                    newObject[property] = other[property];
                }
            }
        }
        return newObject;
    };

    Object.prototype.merge = function(options) {
        return Object.merge(this,options);
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