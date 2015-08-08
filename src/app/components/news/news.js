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
                controller: 'news.ctrl.list',
                resolve: {
                    news_list: ['News', function(News) {
                        return News.query();
                    }]
                }
            })
            .state('index.news.add', {
                url: "/add",
                templateUrl: "app/components/news/add.html",
                controller: 'news.ctrl.add'
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
            limit: 2,
            offset: 0
        };

        $scope.newer = function() {
            $scope.p.offset -= $scope.p.limit;
        };

        $scope.older = function() {
            $scope.p.offset += $scope.p.limit;
        };

        $scope.filterNewsAdmin = function(o) {
            return !o.deleted || $scope.isLoggedIn();
        }
    }]
)

.controller('news.ctrl.add', 
    ['$scope', 'News', '$stateParams', 'FileUploader', 'API', 'AuthService', '$state', 
    function($scope, News, $stateParams, FileUploader, API, AuthService, $state) {
        $scope.can_add_image = false;
        $scope.news = new News();
        $scope.news.image = null;
        $scope.news.author = $scope.infos.user;
        $scope.news.date = new Date();

        $scope.add = function(n) {
            News.save(n).$promise.then(function(nr) {
                $scope.news = nr;
                $scope.can_add_image = true;
                $scope.uploader.url = API.route('news/' + nr.id + '/upload_image/')
            }, function(e) {
                console.log(e);
            });
        };

        $scope.uploadSucces = false;
        $scope.uploader = new FileUploader({
            url: '/',
            headers: { 'Authorization': "JWT " + AuthService.getToken() },
            method: 'PUT',
            alias: 'image', 
            queueLimit: 1
        });
        $scope.uploader.filters.push({
            name: 'imageFilter',
            fn: function(item, options) {
                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        });
        $scope.uploader.onCompleteAll = function() {
            console.log($scope.news);
            $scope.uploadSuccess = true;
            $scope.uploader.clearQueue();
            $state.go('index.news.list');
        };
        $scope.uploader.onSuccessItem = function(item, response, status, headers) {
            // $scope.news.image = response.filename;
        };
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
                n.$sremove().then(function(nr) {
                    // console.log(nr);
                });
            };
            $scope.untrash = function(n) {
                n.deleted = false;
                n.$restore().then(function(nr) {
                    // console.log(nr);
                });
            };
        }]
    };
})
;