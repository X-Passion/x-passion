'use strict';

angular.module('xpassion.news', [])

.config(['$stateProvider', '$urlMatcherFactoryProvider', function($stateProvider, $urlMatcherFactoryProvider) {
    //$urlMatcherFactoryProvider.strictMode(false);
    $stateProvider
        .state('index.news', {
            url: "news",
            abstract: true,
            template: "<ui-view />",
            controller: ['$scope', function($scope){
                $scope.infos.active = 'news';
            }]
        })
            .state('index.news.list', {
                url: "/list",
                templateUrl: "app/components/news/list.html",
                controller: 'news.ctrl.list'
            })
            .state('index.news.add', {
                url: "/add",
                templateUrl: "app/components/news/add.html",
                controller: 'news.ctrl.add',
                resolve: {
                    news_list: ['News', function(News) {
                        return News.query();
                    }]
                }
            })
    ;
}])

.controller('news.ctrl.list', 
    ['$scope', 'news_list', 
    function($scope, news_list) {
        $scope.news_list = news_list;
        $scope.total = news_list.length;
        $scope.p = {
            total: function() {return news_list.length;},
            limit: 1,
            offset: 0
        };

        $scope.newer = function() {
            $scope.p.offset -= $scope.p.limit;
        };

        $scope.older = function() {
            $scope.p.offset += $scope.p.limit;
        }
    }]
)

.controller('news.ctrl.add', 
    ['$scope', 'News', 
    function($scope, News) {
        $scope.news = new News();
    
    }]
)

.directive('xpassionNews', function() {
    return {
        restrict: 'E',
        scope: {
            news: '=news',
            admin: '=?admin'
        },
        templateUrl: 'app/components/news/directive.html',
        controller: ['$scope', 'News', function($scope, News) {
            $scope.trash = function(n) {
                n.deleted = true;
                n.$delete().then(function(nr) {
                    //
                });
            };
            $scope.untrash = function(n) {
                n.deleted = false;
                News.undelete({id: n.id});
            };
        }]
    };
})
;