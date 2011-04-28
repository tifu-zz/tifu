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

    };
})();