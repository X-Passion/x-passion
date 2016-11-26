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
            limit: 10,
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
        };
    }]
)

.controller('news.ctrl.add',
    ['$scope', 'News', '$stateParams', 'FileUploader', 'API', 'AuthService', '$state',
    function($scope, News, $stateParams, FileUploader, API, AuthService, $state) {
        $scope.news = new News();
        $scope.news.image_id = null;
        $scope.image = {
            visibility: 'platal',
            caption: '',
            path: ''
        };
        $scope.alert_image = false;

        $scope.add = function(n) {
            if ($scope.uploader.queue.length > 0) {
                $scope.alert_image = true;
                return
            }
            News.save(n).$promise.then(function(nr) {
                $state.go('index.news.list');
            }, function(e) {
                console.log(e);
            });
        };

        $scope.uploadSucces = false;
        $scope.uploader = new FileUploader({
            url: API.route('images/'),
            headers: { 'Authorization': "JWT " + AuthService.getToken() },
            method: 'POST',
            alias: 'file',
            queueLimit: 1
        });
        $scope.uploader.filters.push({
            name: 'imageFilter',
            fn: function(item, options) {
                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        });
        $scope.uploader.onBeforeUploadItem = function(item) {
            item.formData = [
                {'caption': $scope.image.caption},
                {'platal_only': $scope.image.visibility == 'platal'},
                {'type': 'news'},
            ];
        };
        $scope.uploader.onCompleteAll = function() {
            console.log($scope.news);
            $scope.uploadSuccess = true;
            $scope.uploader.clearQueue();
        };
        $scope.uploader.onSuccessItem = function(item, response, status, headers) {
            $scope.news.image_id = response.id;
            $scope.image.path = response.file;
        };
    }]
)

.directive('xpassionNews', function() {
    return {
        restrict: 'E',
        scope: {
            news: '=news',
            admin: '=?admin',
            index: '=index',
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
