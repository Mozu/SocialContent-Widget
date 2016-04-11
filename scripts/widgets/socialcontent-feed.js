define([ 'underscore', 'modules/api'],
    function (_, Api) {

        function SocailContentFeed(options) {
            this.nameSpace = options.nameSpace || 'mzint',
                this.feedName = options.feedName || 'default',
                this.feedId = options.feedId || 'default'
        }

        var contentFeed = function (options) {
            var socailContentFeed = new SocailContentFeed(options);

            var feedsRequest = function (startIndex, pageSize) {
                return Api.get('entityList', {
                    listName: 'socialContentFeeds@' + socailContentFeed.nameSpace,
                    startIndex: startIndex,
                    pageSize: pageSize
                });
            }

            var mediaItemsRequest = function (startIndex, pageSize, tempFeedId) {
                return Api.get('documentView', {
                    listName: 'socialContentCollection@' + socailContentFeed.nameSpace,
                    startIndex: startIndex,
                    pageSize: pageSize,
                    filter: "properties.feeds eq " + tempFeedId,
                    viewName: "socialContentFeeds"
                });
            };

            return {
                getFeedItems: function (startIndex, pageSize, tempFeedId) {
                    return mediaItemsRequest(startIndex, pageSize, tempFeedId);
                },
                getFeeds: function (startIndex, pageSize) {
                    return feedsRequest();
                }
            }
        };

        return {
            getSocialContentFeeds: function (options) {
                return contentFeed(options);
            }
        }
    });

