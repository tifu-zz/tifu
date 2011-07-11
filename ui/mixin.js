(function() {
    var ui = fu.ui;
    ui.mixinViewAppend = function(view) {
        var yOffset = 0;

        view.append = function(obj) {
            var objTotalHeight = obj.height + (obj.top ? obj.top : 0);
            obj.top = (obj.top ? obj.top : 0) + yOffset;
			obj.left = obj.left || (obj.right ? undefined : 0);
            view.add(obj);
            yOffset += objTotalHeight;
        };

		view.currentY = function() {
			return yOffset;
		};
		
		view.reset = function() {
		    if (view.children) {
                view.children.forEach(function(child) {
                    view.remove(child);
                });
            }
            yOffset = 0;
		};

    };
})();