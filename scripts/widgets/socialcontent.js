define(['modules/jquery-mozu', 'underscore', 'modules/api', 'modules/backbone-mozu', 'hyprlivecontext'],
    function ($, _, Api, Backbone, HyprLiveContext) {
        var _currentStartIndex = 0,
            _totalCount = 0;

        var nameSpace = "a0842dd";

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
        
      
        var getFeedName = function() {
            return $("#socialcontent-widget").data("mz-socialcontent").feed;
        }

        var fadeInFeedItems = function () {
            $('.feed-item-wrapper .feed-item > div').each(function (index, value) {
                window.setTimeout(function () {
                    $(value).fadeIn(400);
                }, 200 * index);
            });
        };
         
        var getContentRequest = function(feedName) {
           return Api.get('documentView', {
                listName: 'socialContentCollection@'+nameSpace,
                startIndex: getTotalCount(),
                pageSize: 5,
                viewName: "socialContentFeeds",
                filter:"properties.feeds eq "+feedName,
                sortBy:"properties.createDate desc"
            });
       };

        var feedRequest = Api.get('entity', {
                listName: 'socialContentFeeds@'+nameSpace,
                startIndex: 0,
                pageSize: 1,
                filter: "name eq "+getFeedName()
        });


        var loadFeedItems = function () {
            $('#loading-block, #loading-block-wrapper').show();
            feedRequest.then(function(feedList){
                getContentRequest(feedList.data.items[0].id).then(function (data) {
                    data = data.data;
                    $.each(data.items, function (index, item) {
                        SocialContentFeed.add(new FeedItem(item.properties));
                    });
                    setStartIndex(data.startIndex);
                    setTotalCount(data.totalCount);
                    $('#loading-block, #loading-block-wrapper').hide();
                }, function (jqxhr, settings, exception) {
                    console.log(jqxhr);
                    $('#loading-block, #loading-block-wrapper').hide();
                });
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

        var SocialContentFeed = new Backbone.Collection();

        var SocialContentView = Backbone.MozuView.extend({
            templateName: 'widgets/social/socialcontent-feed-item',
            getRenderContext: function () {
                var context = Backbone.MozuView.prototype.getRenderContext.apply(this, arguments);

                return context;
            },
            render: function () {
                Backbone.MozuView.prototype.render.apply(this, arguments);

            }
        });


        $(document).ready(function() {

            var $socialContentWidget = $('[data-mz-socialcontent] .feed-item-wrapper');

            var timeout = 0,
                setTimeOut = function () {
                    timeout = 500;
                },
                clearTimeout = function () {
                    timeout = 0;
                };
            var getWidgetHeight = function () {
                return $('#socialcontent-widget').height();
            };

            if ($('.socialcontent-widget-wrapper').hasClass('isMobile')) {
                $('.socialcontent-widget-wrapper').height($(window).height());

                //A workaround for some weird height issue
                if ($(window).height() !== $('body').height()) {
                    $('body').height($(window).height());
                    $('body').css('overflow', 'hidden');
                }
            }

            $('#socialcontent-widget').scroll(function () {
                if ($('#isocialcontent-widget').scrollTop() + $('#socialcontent-widget').height() > ($('.feed-item-wrapper').outerHeight() + $('.feed-intro-text').outerHeight())) {
                    if (timeout === 0) {
                        setTimeOut();
                        window.setTimeout(function (clearTimeout) {
                            clearTimeout();
                        }(clearTimeout), timeout);
                        loadFeedItems();
                    }
                }
            });

            var socialContentView = new SocialContentView({
                model: SocialContentFeed,
                el: $socialContentWidget
            });

            SocialContentFeed.on("add", function () {
                socialContentView.render();
            });

            socialContentView.render();

            loadFeedItems();

        });
    }
);