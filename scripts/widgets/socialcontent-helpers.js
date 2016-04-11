define(['modules/jquery-mozu', 'underscore', 'hyprlivecontext'],
    function ($, _, HyprLiveContext) {

        var _appExists;

        var getHostname = function(){
            return HyprLiveContext.locals.pageContext.secureHost;
        }

        var mobileURLByLink = function(link) {
            var URL = "";
            switch (link.linkType) {
                case 'categoryId' :
                    URL = 'bf://mozu.com/categories/' + link.link;
                    break;
                case 'productId' :
                    URL = 'bf://mozu.com/products/' + link.link;
                    break;
                default :
                    URL = link.link;
                    break;
            }
            return URL;
        };

        var desktopURLByLink = function(link) {
            var URL = "";
            switch (link.linkType) {
                case 'categoryId' :
                    URL = getHostname() + '/c/' + link.link;
                    break;
                case 'productId' :
                    URL = getHostname() + '/p/' + link.link;
                    break;
                default :
                    URL = link.link;
                    break;
            }
            return URL;
        };

        var isMobileDevice = function() {
            if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
                return true;
            }
            return false;
        }

        var mobileAppExists = function() {
            var appDeepLink = "bf://mozu.com/";
            if (_appExists !== "boolean") {
                $.get(appDeepLink, function (data) {
                }).done(function () {
                        return _appExists = true;
                    })
                    .fail(function () {
                        return _appExists = false;
                    });
            }
            return _appExists;
        }

        var timeElapsed = function(dateTime){
            var postedTime = dateTime;  // Jan 1, 2011
            var thisTime = new Date();              // now
            var elapsedTime = thisTime.getTime() - postedTime.getTime();   // now - jan 1
            elapsedTime = elapsedTime * 1000*60*60*24;

            if(elapsedTime > 1) {
                return elapsedTime + 'days ago'
            }
            else if (elapsedTime / 24 > 1) {

                return elapsedTime /24 + 'hours ago'
            }
            else if(elapsedTime /24/60 > 1){
                return elapsedTime /24/60 + 'minutes ago'
            }
            else {
                return elapsedTime /24/60/60 + 'seconds ago'
            }

        }

        return {
            mobileURLByLink: function (link) {
                return mobileURLByLink(link);
            },
            desktopURLByLink: function (link) {
                return desktopURLByLink(link);
            },
            isMobileDevice: isMobileDevice(),
            mobileAppExists : mobileAppExists(),
            timeElapsed: function (dateTime) {
                return timeElapsed(dateTime);
            }
        }
    });

