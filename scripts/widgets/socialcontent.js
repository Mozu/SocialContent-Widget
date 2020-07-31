/*jshint -W093 */
define(['modules/jquery-mozu', 'underscore', 'modules/api', 'modules/backbone-mozu', 'hyprlivecontext'],
    function($, _, Api, Backbone, HyprLiveContext) {
        var _currentStartIndex = 0,
            _totalCount = 0,
            _templateData,
            _hostName,
            _appExists;

        var nameSpace = "mozuadmin";

        var setStartIndex = function(startIdx) {
            _currentStartIndex = startIdx;
        };

        var getStartIndex = function() {
            if (typeof _currentStartIndex == 'undefined' || _currentStartIndex < -1) {
                return 0;
            }
            return _currentStartIndex;
        };

        var setTotalCount = function(count) {
            _totalCount = count;
        };

        var getTotalCount = function() {
            if (typeof _totalCount == 'undefined' || _totalCount < -1) {
                return 0;
            }
            return _totalCount;
        };


        var getFeedName2 = function() {
            return $("#socialcontent-widget").data("mz-socialcontent").feed;
        }

        var fadeInFeedItems = function() {
            $('.feed-item-wrapper .feed-item > div').each(function(index, value) {
                window.setTimeout(function() {
                    $(value).fadeIn(400);
                }, 200 * index);
            });
        };

        var mediaItemsRequest = function(feedId) {
            return Api.get('documentView', {
                listName: 'socialContentCollection@' + nameSpace,
                startIndex: 0, //getTotalCount(),
                pageSize: 15,
                filter: "properties.feeds eq " + feedId,
                viewName: "socialContentFeeds"
            });
        };

        var getTemplateData = function() {
            if (typeof _templateData !== 'object') {
                return _templateData = $('#socialcontent-widget').data('mz-socialcontent');
            }
            return _templateData;
        }

        var getFeedName = function() {
            var data = $("#socialcontent-widget").data("mz-socialcontent");
            if (typeof data === 'object') {
                return data.feed;
            }
        }

        var feedsRequest = Api.get('entityList', {
            listName: 'socialContentFeeds@' + nameSpace,
            startIndex: 0,
            pageSize: 15
        });


        var loadFeedItems = function() {
            $('#loading-block, #loading-block-wrapper').show();
            feedsRequest.then(function(feedList) {
                var feedName = getFeedName(),
                    feedId = 0;
                $.each(feedList.data.items, function(index, value) {
                    if (value.name === feedName) {
                        feedId = value.id;
                        return false;
                    }
                })

                mediaItemsRequest(feedId).then(function(data) {
                    data = data.data;
                    $.each(data.items, function(index, item) {
                        if (item.properties.link) {
                            item.properties.actionLink = determineItemLink(item.properties.link, feedId);
                            item.properties.actionLinkString = JSON.stringify(item.properties.actionLink);
                        }
                        SocialContentFeed.add(new FeedItem(item.properties));
                    });
                    setStartIndex(data.startIndex);
                    setTotalCount(data.totalCount);
                    $('#loading-block, #loading-block-wrapper').hide();
                }, function(jqxhr, settings, exception) {
                    console.log(jqxhr);
                    $('#loading-block, #loading-block-wrapper').hide();
                });
            });
        };

        var FeedItem = Backbone.MozuModel.extend({
            defaults: {
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
            initialize: function() {
                //set("caption", this.captionEllipsis(get("caption")));
            }
        });

        var SocialContentFeed = new Backbone.Collection();

        var SocialContentView = Backbone.MozuView.extend({
            templateName: 'widgets/social/socialcontent-feed-mobile',
            getRenderContext: function() {
                var context = Backbone.MozuView.prototype.getRenderContext.apply(this, arguments);

                return context;
            },
            render: function() {
                Backbone.MozuView.prototype.render.apply(this, arguments);

            }
        });

        var mobileURLByLink = function(link) {
            var URL = "";
            switch (link.linkType) {
                case 'categoryId':
                    URL = 'bf://mozu.com/categories/' + link.link;
                    break;
                case 'productId':
                    URL = 'bf://mozu.com/products/' + link.link;
                    break;
                default:
                    URL = link.link;
                    break;
            }
            return URL;
        };

        var desktopURLByLink = function(link) {
            var URL = "";
            switch (link.linkType) {
                case 'categoryId':
                    URL = getHostname() + '/c/' + link.link;
                    break;
                case 'productId':
                    URL = getHostname() + '/p/' + link.link;
                    break;
                default:
                    URL = link.link;
                    break;
            }
            return URL;
        };

        var determineItemLink = function(link, id) {
            var actionLink = {};
            if (typeof link === 'object') {
                $.each(link, function(index, value) {
                    if (value && value.associatedFeed === id) {
                        actionLink = value;
                        return false;
                    }
                })
            }
            return actionLink;
        };

        var isMobileDevice = function() {
            if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                return true;
            }
            return false;
        };

        var mobileAppExists = function() {
            var appDeepLink = "bf://mozu.com/";
            if (_appExists !== "boolean") {
                $.get(appDeepLink, function(data) {}).done(function() {
                    return _appExists = true;
                })
                    .fail(function() {
                        return _appExists = false;
                    });
            }
            return _appExists;
        };

        var getHostname = function() {
            return _hostName = HyprLiveContext.locals.pageContext.secureHost;
        }


        $(document).ready(function() {
            getHostname();
            var $socialContentWidget = $('[data-mz-socialcontent] .feed-item-wrapper');

            var timeout = 0,
                setTimeOut = function() {
                    timeout = 500;
                },
                clearTimeout = function() {
                    timeout = 0;
                };
            var getWidgetHeight = function() {
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

            $('#socialcontent-widget').scroll(function() {
                if ($('#socialcontent-widget').scrollTop() + $('#socialcontent-widget').height() > ($('.feed-item-wrapper').outerHeight() + $('.feed-intro-text').outerHeight())) {
                    if (timeout === 0) {
                        setTimeOut();
                        window.setTimeout(function(clearTimeout) {
                            clearTimeout();
                        }(clearTimeout), timeout);
                        loadFeedItems();
                    }
                }
            });

            $('#socialcontent-widget').on('click', '.call-to-action a', function(e) {
                e.preventDefault();
                var linkData = $(this).data('action-link'),
                    URL;
                if (typeof linkData === 'object') {
                    if (getTemplateData() === 'isMobile') {
                        URL = mobileURLByLink(linkData.mobileLink);
                        window.location.href = URL;
                    }
                    URL = desktopURLByLink(linkData.desktopLink);
                    window.location.href = URL;
                }
            });

            var socialContentView = new SocialContentView({
                model: SocialContentFeed,
                el: $socialContentWidget
            });

            SocialContentFeed.on("add", function() {
                socialContentView.render();
            });

            socialContentView.render();

            loadFeedItems();



        });
    }
);