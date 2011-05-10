(function() {
    var ui = fu.ui;
    ui.mixinViewAppend = function(view) {
        var yOffset = 0;

        view.append = function(obj) {
            var objTotalHeight = obj.height + (obj.top ? obj.top : 0);
            obj.top = (obj.top ? obj.top : 0) + yOffset;
            obj.left = (obj.left ? obj.left : 0);
            view.add(obj);
            yOffset += objTotalHeight;
        };

		view.appendOnCreate = function(createFunction, createParams) {
			var obj = createFunction(createParams.merge({
	            top:(createParams.top || 0) + yOffset,
	            left:(createParams.left || 0)
			}));
            view.add(obj);
            yOffset +=  obj.height + (createParams.top || 0);
		};

		view.currentY = function() {
			return yOffset;
		};

    };
})();