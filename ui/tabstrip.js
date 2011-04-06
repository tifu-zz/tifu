(function() {

    fu.ui.createTabStrip = function(options) {
        options = options || {};
        var params = {
            labels: fu.lib.undefinedOr(options.labels, []),
            onselect: fu.lib.undefinedOr(options.onselect, null),
            top: fu.lib.undefinedOr(options.top, .1),
            height: fu.lib.undefinedOr(options.height, 40),
            backgroundColor: fu.lib.undefinedOr(options.backgroundColor, '#000'),
            gradientColor: fu.lib.undefinedOr(options.gradientColor, '#444'),
            selectedColor: fu.lib.undefinedOr(options.selectedColor, '#fff'),
            unselectedColor: fu.lib.undefinedOr(options.unselectedColor, '#999'),
            fontSize: fu.lib.undefinedOr(options.fontSize, 14)
        }

        var labelViews = [];
        var lastSelectedLabel = null;
        var totalWidth = 0;

        var containerView = Titanium.UI.createView({
            top:params.top,
            height:params.height,
            width:320,
            backgroundColor:params.backgroundColor,
            backgroundGradient: {
                type:'linear',
                colors:[
                    {color:params.gradientColor,position:0.0},
                    {color:params.backgroundColor,position:1.0}
                ]
            }
        });

        var leftArrow = Ti.UI.createLabel({
            text:String.fromCharCode(171),
            font:{fontSize:params.height / 2,fontWeight:'bold'},
            color:params.selectedColor,
            height:params.height,
            width:15,
            top:params.top,
            left:2,
            textAlign:'left',
            visible:false
        });
        containerView.add(leftArrow);

        var scrollView = Titanium.UI.createScrollView({
            layout:'horizontal',
            top:params.top,
            left:17,
            height:params.height,
            width:286
        });
        containerView.add(scrollView);

        var rightArrow = Ti.UI.createLabel({
            text:String.fromCharCode(187),
            font:{fontSize:params.height / 2,fontWeight:'bold'},
            color:params.selectedColor,
            height:params.height,
            width:15,
            top:params.top,
            right:2,
            textAlign:'right',
            visible:false
        });
        containerView.add(rightArrow);

        scrollView.addEventListener('scroll', function(e) {
            leftArrow.visible = e.x > 5;
            rightArrow.visible = e.x < scrollView.contentWidth - scrollView.width;
        });

        containerView.labels = function(labels) {
            params.labels = labels;
            resetLabels();
        }

        containerView.selectTab = function(index) {
            select(labelViews[index]);
        }

        function resetLabels() {
            totalWidth = 0;
            labelViews = [];
            lastSelectedLabel = null;
            var oldLabels = scrollView.children;
            if (oldLabels) {
                for (var i = 0,count = oldLabels.length; i < count; i++) {
                    scrollView.remove(oldLabels[i]);
                }
            }

            var labels = params.labels;
            for (var i = 0,count = labels.length; i < count; i++) {
                var button = createButton(labels[i], i);
                scrollView.add(button);
            }
            scrollView.contentWidth = totalWidth;
            rightArrow.visible = totalWidth > scrollView.width;
        }

        function createButton(title, index) {
            var buttonView = Ti.UI.createView({
                top:params.top,
                height:params.height
            });

            var label = Ti.UI.createLabel({
                text:title,
                font:{fontSize:params.fontSize,fontStyle:'bold'},
                width:'auto',
                color:params.selectedColor,
                textAlign:'center',
                height:params.height,
                touchEnabled:false
            });
            label.index = index;
            labelViews.push(label);
            buttonView.add(label);
            showAsUnSlected(label);
            buttonView.addEventListener('click', function(e) {
                select(e.source.children[0]);
            });
            buttonView.width = label.size.width + 20;
            totalWidth += buttonView.width;

            return buttonView;
        }

        function select(label) {
            //Ti.API.info("selecting = " + label);
            if (!lastSelectedLabel || lastSelectedLabel.index != label.index) {
                if (lastSelectedLabel) {
                    showAsUnSlected(lastSelectedLabel);
                }
                showAsSelected(label)
                if (params.onselect) {
                    params.onselect(label.index);
                }
            }
        }

        function showAsSelected(label) {
            label.color = params.selectedColor;
            label.getParent().borderWidth = 1;
            lastSelectedLabel = label;
        }

        function showAsUnSlected(label) {
            label.color = params.unselectedColor;
            label.getParent().borderWidth = 0;
        }

        resetLabels();
        return containerView;
    }

})();