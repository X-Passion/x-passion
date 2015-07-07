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
            .state('index.news.add', {
                url: "/add",
                templateUrl: "app/components/news/add.html",
                controller: 'news.ctrl.add'
            })
    ;
}])

.controller('news.ctrl.add', 
    ['$scope, News', 
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