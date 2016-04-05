define(['modules/jquery-mozu', 'underscore', 'modules/api', 'modules/backbone-mozu', 'hyprlivecontext'],
    function ($, _, Api, Backbone, HyprLiveContext) {
        var _currentStartIndex = 0,
            _totalCount = 0,
            _templateData = "",
            siteHostName,
            _appExists;

        var nameSpace = "a0842dd";

        var getTemplateData = function() {
            if(typeof _templateData !== 'object') {
                return _templateData = $('#socialcontent-widget').data('mz-socialcontent');
            }
            return _templateData;
        }

        var getFeedName = function() {
            var data = $("#socialcontent-widget").data("mz-socialcontent");
            if(typeof data === 'object') {
                return data.feed;
            }
        }

        var feedsRequest = Api.get('entityList', {
            listName: 'socialContentFeeds@'+nameSpace,
            startIndex: 0,
            pageSize: 15
        });

        var mediaItemsRequest = function(feedId) {
           return Api.get('documentView', {
                listName: 'socialContentCollection@'+nameSpace,
                startIndex: 0, //getTotalCount(),
                pageSize: 15,
                filter:"properties.feeds eq " + feedId,
                viewName: "socialContentFeeds"
            });
       };


        var mobileURLByLink = function(link) {
            var URL = "";
            switch (link.linkType) {
                case 'cateogry' :
                    URL = 'bf://mozu.com/categories/' + link.link;
                    break;
                case 'product' :
                    URL = 'bf://mozu.com/products/' + link.link;
                    break;
                default :
                    URL = link.link;
                    break;
            }
        };

        var desktopURLByLink = function(link) {
            var URL = "";
            switch (link.linkType) {
                case 'cateogry' :
                    URL = '/c/' + link.link;
                    break;
                case 'product' :
                    URL = '/p/' + link.link;
                    break;
                default :
                    URL = link.link;
                    break;
            }
        };

        var isMobileDevice = function() {
            if( '/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i'.test(navigator.userAgent) ) {
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

        var loadFeedItems = function () {
            $('#loading-block, #loading-block-wrapper').show();
            feedsRequest.then(function(feedList){
                var feedName = getFeedName(),
                    feedId = 0;
                $.each(feedList.data.items, function (index, value){
                    if(value.name === feedName) {
                        feedId = value.id;
                        return false;
                    }
                })

                mediaItemsRequest(feedId).then(function (data) {
                    data = data.data;

                    // If Grid send in all item to spilt items by 'slides' aka rows
                    //

                    $.each(data.items, function (index, item) {
                        //item.properties.activeLink =
                        SocialContentFeed.add(new FeedItem(item));
                    });


                    //setStartIndex(data.startIndex);
                    //setTotalCount(data.totalCount);
                    $('#loading-block, #loading-block-wrapper').hide();
                }, function (jqxhr, settings, exception) {
                    console.log(jqxhr);
                    $('#loading-block, #loading-block-wrapper').hide();
                });
            });
        };

        var FeedItem = Backbone.MozuModel.extend({
            defaults: {
                data: {},
                maxCharLength: 150
            }
        });

        var SocialContentFeed = new Backbone.Collection();
        var SocialContentFeedItem = new Backbone.Collection();

        //If grid use a SociaContentGrid view if a new Grid template


        var SocialContentCarouselView = Backbone.MozuView.extend({
            templateName: 'widgets/social/socialcontent-feed-carousel',
            getRenderContext: function () {
                var context = Backbone.MozuView.prototype.getRenderContext.apply(this, arguments);

                return context;
            },
            events: {
                "click img": "clicked"
            },
            clicked: function(e){
                e.preventDefault();
                var cid = $(e.currentTarget).data("cid")
                var item = this.model.get(cid);
                loadModalWindow(item);
                console.log(item);
            },
            render: function () {
                Backbone.MozuView.prototype.render.apply(this, arguments);

            }
        });

        var SocialContentMobileView = Backbone.MozuView.extend({
            templateName: 'widgets/social/socialcontent-feed-item',
            getRenderContext: function () {
                var context = Backbone.MozuView.prototype.getRenderContext.apply(this, arguments);

                return context;
            },
            render: function () {
                Backbone.MozuView.prototype.render.apply(this, arguments);

            }
        });

        var SocialContentWindowView = Backbone.MozuView.extend({
            templateName: 'widgets/social/socialcontent-model-window',
            getRenderContext: function () {
                var context = Backbone.MozuView.prototype.getRenderContext.apply(this, arguments);

                return context;
            },
            render: function () {
                Backbone.MozuView.prototype.render.apply(this, arguments);

            }
        });

        var loadModalWindow = function(item) {
            SocialContentFeedItem.reset();
            SocialContentFeedItem.add(new FeedItem(item))
            var socialContentWidowView = new SocialContentWindowView({
                model: SocialContentFeedItem,
                el: $('document')
            });
            socialContentWidowView.render();
            //Int Model Window
        };


        $(document).ready(function() {


            var $socialContentWidget = $('[data-mz-socialcontent] .feed-item-wrapper');
            var $document = $('document');
            //var _siteHostName = HyprLiveContext;
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

            /*if ($('.socialcontent-widget-wrapper').hasClass('isMobile')) {
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
            });*/

            $('socialcontent-widget').on('click', '.call-to-action', function(){
                var linkData = $(this).data('action-link'),
                    URL;
                if(typeof linkData === 'object'){
                    if(getTemplateData() === 'isMobile' && mobileAppExists()) {
                        URL = mobileURLByLink(linkData.mobileLink);
                        window.location.href = URL;
                    }
                    URL = desktopURLByLink(linkData.desktop);
                    window.location.href = URL;
                }
            });

            //If grid some Grid view and model and render acord.
            var socialContentCarouselView = new SocialContentCarouselView({
                model: SocialContentFeed,
                el: $socialContentWidget
            });



            SocialContentFeed.on("add", function () {
                socialContentCarouselView.render();
            });

            socialContentCarouselView.render();

            loadFeedItems();
            mobileAppExists();

        });
    }
);
