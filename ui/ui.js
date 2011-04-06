fu.ui = (function() {
    var ui = {
        createLoadingView:function(options) {
            var options = options || {};
            var modal = options.modal || false;
            var top = options.top || 102;

            var loadingView = Ti.UI.createView({
                top:top,
                width:200,
                height:70,
                backgroundColor:'#000',
                borderRadius:10,
                opacity:0.8
            });
            var activityIndicator = Titanium.UI.createActivityIndicator({
                style:Titanium.UI.iPhone.ActivityIndicatorStyle.BIG,
                left:30,
                height:'auto',
                width:'auto'
            });
            loadingView.add(activityIndicator);
            var loadingLabel = Ti.UI.createLabel({
                left:75,
                height:'auto',
                width:'auto',
                font:{
                    fontSize:20,
                    fontWeight:'bold'
                },
                color:"#fff",
                text:"Loading..."
            });
            loadingView.add(loadingLabel);
            loadingView.showLoading = function() {
                loadingLabel.show();
                activityIndicator.show();
                loadingView.show();
            }
            loadingView.hideLoading = function() {
                loadingLabel.hide();
                activityIndicator.hide();
                loadingView.hide();
            }
            if (modal) {
                var window = Titanium.UI.createWindow();
                window.add(loadingView);

                window.showLoading = function() {
                    window.open();
                    loadingView.showLoading();
                }

                window.hideLoading = function() {
                    loadingView.hideLoading();
                    window.close();
                };
                return window;
            }
            return loadingView;
        }
    }
    return ui;
})();