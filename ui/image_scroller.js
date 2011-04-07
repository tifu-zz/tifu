(function() {
    fu.ui.createImageScroller = function(options) {
        options = options || {};
        var urls = fu.lib.undefinedOr(options.urls,[]);
        var defaultImage = fu.lib.undefinedOr(options.defaultImage,'images/loading.png');
        var backgroundColor = fu.lib.undefinedOr(options.backgroundColor,'#000');
        var index = 0;
        var lastPage = 0;
        var height = fu.lib.undefinedOr(options.height, 320);
        var top = fu.lib.undefinedOr(options.top,0);

        var imageScroller = Ti.UI.createView({
            top:top,
            backgroundColor:backgroundColor,
            height:height
        });

        var scrollableView = Ti.UI.createScrollableView({
            zIndex:11
        });
        var imageViews = [];
        var tempImageView = Ti.UI.createImageView({
            zIndex:10,
            visible:false
        });
        scrollableView.views = imageViews;
        var loadingIndicator = fu.ui.createLoadingView({modal:true});
        imageScroller.add(tempImageView);
        imageScroller.add(scrollableView);

        scrollableView.addEventListener('scroll', function(e) {
            var page = e.currentPage;
            if (lastPage === page) {
                return;
            }
            var goingRight = (page - lastPage) > 0;
            lastPage = page;
            if (goingRight) {
                index++;
            } else {
                index--;
            }
            if (page == 0 || page == 2) {
                shiftImages();
            }
            fireScrollEvent();
        });

        function shiftImages() {
            tempImageView.image = urls[index];
            if (index > 0 && index < urls.length - 1) {
                lastPage = 1;

                tempImageView.animate({zIndex:11,visible:true,duration:0});
                scrollableView.animate({zIndex:10,visible:false,duration:0});

                imageViews[0].image = urls[index - 1];
                imageViews[1].image = urls[index];
                imageViews[2].image = urls[index + 1];
                scrollableView.currentPage = 1;

                scrollableView.animate({zIndex:11,visible:true,duration:500});
                tempImageView.animate({zIndex:10,visible:false,duration:500});
            }
        }

        imageScroller.goto = function(imageIndex) {
            if (imageIndex >= 0 && imageIndex < urls.length) {
                index = imageIndex;

                if (index === 0) {
                    start = 0;
                    lastPage = 0;
                } else if (urls.length !== 2 && index === urls.length - 1) {
                    start = index - 2;
                    lastPage = 2;
                } else {
                    start = index - 1;
                    lastPage = 1;
                }
                var end = (urls.length - start < 3) ? urls.length : start + 3;

                for (var i = start, j = 0; i < end; i++,j++) {
                    imageViews[j].image = urls[i];
                }
                scrollableView.currentPage = lastPage;
                fireScrollEvent();
            }
        }

        function fireScrollEvent() {
            imageScroller.fireEvent('scrolled', {index:index});
        }

        imageScroller.append = function(_urls) {
            for (var i = 0,count = _urls.length; i < count; i++) {
                urls.push(_urls[i]);
            }
            if (imageViews.length < 3) {
                for (var j = 0; (urls.length > j) && (imageViews.length < (j + 1)) && (imageViews.length < 3); j++) {
                    imageViews.push(Ti.UI.createImageView({
                        defaultImage:defaultImage
                    }));
                }
                scrollableView.views = imageViews;
            }
            shiftImages();
        };

        imageScroller.load = function(_urls) {
            urls = [];
            imageViews = [];
            imageScroller.append(_urls);
        };

        imageScroller.count = function() {
            return urls.length;
        }

        imageScroller.showLoading = function() {
            loadingIndicator.showLoading();
        }

        imageScroller.hideLoading = function() {
            loadingIndicator.hideLoading();
        }

        return imageScroller;
    }

})();