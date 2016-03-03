define(['modules/jquery-mozu', 'underscore', 'modules/api', 'modules/backbone-mozu', 'hyprlivecontext'],
    function ($, _, Api, Backbone, HyprLiveContext) {
        var _currentStartIndex = 0,
            _totalCount = 0;

        var setStartIndex = function (startIdx) {
            _currentStartIndex = startIdx;
        };

        var getStartIndex = function () {
            if (typeof _currentStartIndex == 'undefined' || _currentStartIndex < -1) {
                return 0;
            }
            return _currentStartIndex;
        };

        var setTotalCount = function (count) {
            _totalCount = count;
        };

        var getTotalCount = function () {
            if (typeof _totalCount == 'undefined' || _totalCount < -1) {
                return 0;
            }
            return _totalCount;
        };
        
      

        var fadeInFeedItems = function () {
            $('.feed-item-wrapper .feed-item > div').each(function (index, value) {
                window.setTimeout(function () {
                    $(value).fadeIn(400);
                }, 200 * index);
            });
        };
         
        var instagramRequest = Api.get('documentView', {
                listName: 'instagramFeed@a0842dd'/* Hypr.getThemeSetting('') */,
                startIndex: getTotalCount(),
                pageSize: 5,
                viewName: "instagramFeeds"
        });


        var loadFeedItems = function () {
            $('#loading-block, #loading-block-wrapper').show();
            instagramRequest.then(function (data) {
                data = data.data;
                $.each(data.items, function (index, item) {
                    InstagramFeed.add(new FeedItem(item.properties));
                });
                setStartIndex(data.startIndex);
                setTotalCount(data.totalCount);
                $('#loading-block, #loading-block-wrapper').hide();
            }, function (jqxhr, settings, exception) {
                console.log(jqxhr);
                $('#loading-block, #loading-block-wrapper').hide();
            });
        };

        var FeedItem = Backbone.MozuModel.extend({
            defaults:{
                data: {},
                maxCharLength: 150
            },
            onClickCallToAction: function() {
              
            },
            //captionEllipsis: function(text) {
            //    var ret = text;
            //    if (ret.length > get('maxCharLength')) {
            //        ret = ret.substr(0, get('maxCharLength')-3) + "...";
            //    }
            //    return ret;
            //},
            initialize: function () {
                //set("caption", this.captionEllipsis(get("caption")));
            }
        });

        var InstagramFeed = new Backbone.Collection();

        var InstagramView = Backbone.MozuView.extend({
            templateName: 'widgets/social/instagram-feed-item',
            getRenderContext: function () {
                var context = Backbone.MozuView.prototype.getRenderContext.apply(this, arguments);

                return context;
            },
            render: function () {
                Backbone.MozuView.prototype.render.apply(this, arguments);

            }
        });


        $(document).ready(function() {

            var $instagramWidget = $('[data-mz-instagram] .feed-item-wrapper');

            var timeout = 0,
                setTimeOut = function () {
                    timeout = 500;
                },
                clearTimeout = function () {
                    timeout = 0;
                };
            var getWidgetHeight = function () {
                return $('#instagram-widget').height();
            };

            if ($('.instagram-widget-wrapper').hasClass('isMobile')) {
                $('.instagram-widget-wrapper').height($(window).height());

                //A workaround for some weird height issue
                if ($(window).height() !== $('body').height()) {
                    $('body').height($(window).height());
                    $('body').css('overflow', 'hidden');
                }
            }

            $('#instagram-widget').scroll(function () {
                if ($('#instagram-widget').scrollTop() + $('#instagram-widget').height() > ($('.feed-item-wrapper').outerHeight() + $('.feed-intro-text').outerHeight())) {
                    if (timeout === 0) {
                        setTimeOut();
                        window.setTimeout(function (clearTimeout) {
                            clearTimeout();
                        }(clearTimeout), timeout);
                        loadFeedItems();
                    }
                }
            });

            var instagramView = new InstagramView({
                model: InstagramFeed,
                el: $instagramWidget
            });

            InstagramFeed.on("add", function () {
                instagramView.render();
            });

            instagramView.render();

            loadFeedItems();

        });
    }
);