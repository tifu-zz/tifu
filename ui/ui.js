fu.ui = (function() {
    var ui = {
        createTableView:function(options) {
            var tableView = Ti.UI.createTableView(options);
            var loadingIndicator = fu.ui.createLoadingView();
            tableView.add(loadingIndicator);

            tableView.load = function(buildData) {
                tableView.showLoading();
                var data = buildData();
                tableView.hideLoading();
                tableView.setData(data);
                tableView.scrollToTop(0, {animated:true});
            };

            tableView.showLoading = function() {
                tableView.setData([]);
                loadingIndicator.showLoading();
            };

            tableView.hideLoading = function() {
                loadingIndicator.hideLoading();
                if (tableView.endLoading) {
                    tableView.endLoading();
                }
            };
            return tableView;
        },
        createLoadingView:function(options) {
            options = fu.lib.defined(options, {});
            var modal = fu.lib.defined(options.modal, false);
            var top = fu.lib.defined(options.top, 102);
            var backgroundColor = fu.lib.defined(options.backgroundColor, '#000');
            var height = fu.lib.defined(options.height, 70);

            var loadingView = Ti.UI.createView({
                top:top,
                width:200,
                height:height,
                backgroundColor:backgroundColor,
                borderRadius:10,
                opacity:0.8,
                visible:false
            });
            var activityView = Ti.UI.createView({
                width:200, 
                height:70,
                top:0
            });
            var activityIndicator = Titanium.UI.createActivityIndicator({
                style:Titanium.UI.iPhone.ActivityIndicatorStyle.BIG,
                left:30,
                height:'auto',
                width:'auto'
            });
            activityView.add(activityIndicator);
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
            activityView.add(loadingLabel);
            loadingView.add(activityView);
            loadingView.showLoading = function() {
                loadingLabel.show();
                activityIndicator.show();
                loadingView.show();
            };
            loadingView.hideLoading = function() {
                loadingLabel.hide();
                activityIndicator.hide();
                loadingView.hide();
            };
            if (modal) {
                var window = Titanium.UI.createWindow({});
                window.add(loadingView);

                window.showLoading = function() {
                    window.open();
                    loadingView.showLoading();
                };

                window.hideLoading = function() {
                    loadingView.hideLoading();
                    window.close();
                };
                return window;
            }
            return loadingView;
        },
        formatDateYearTime:function(date) {
            var datestr = (date.getMonth()+1) + '/' + date.getDate() + '/' + date.getFullYear();
            var hours = date.getHours();
            var mins = date.getMinutes();
            if (hours >= 12) {
                datestr += ' ' + (hours == 12 ? hours : hours - 12) + ':' + (mins < 10 ? ('0' + mins) : mins) + ' PM';
            }
            else {
                datestr += ' ' + hours + ':' + (mins < 10 ? ('0' + mins) : mins) + ' AM';
            }
            return datestr;
        }
    };
    return ui;
})();

Ti.include(
    '/tifu/ui/pull_to_refresh.js',
    '/tifu/ui/mixin.js',
    '/tifu/ui/image_scroller.js'
);