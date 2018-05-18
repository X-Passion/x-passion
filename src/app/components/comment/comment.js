'use strict';

angular.module('xpassion.comment', [])

.config(['$stateProvider', '$urlMatcherFactoryProvider', function($stateProvider, $urlMatcherFactoryProvider) {
    $stateProvider
        .state('index.comments', {
            url: "comments",
            abstract: true,
            template: "<ui-view />",
            controller: ['$scope', function($scope){
                $scope.infos.active = 'comments';
            }]
        })
            .state('index.comments.list', {
                url: "/list",
                templateUrl: "app/components/comment/list.html",
                controller: 'comments.ctrl.list',
                resolve: {
                    comments_list: ['Comment', function(Comment) {
                        return Comment.query();
                    }]
                }
            })
    ;
}])

.controller('comments.ctrl.list', 
    ['$scope', 'Comment', 'comments_list', '$location', 
    function($scope, Comment, comments_list, $location){
        $scope.comments = comments_list;

        $scope.filterDeleted = function() {
            if ($scope.canEdit()) {
                return '';
            } else {
                return {
                    deleted: false
                };
            }
        }

        $scope.goToForm = function() {
            $location.hash('formComment');
        };

        $scope.comment = new Comment();
        $scope.add = function(c) {
            c.$save().then(function(ec) {
                $scope.comments = Comment.query();
                $scope.comment = new Comment();
            }, function(errors) {
                console.log(errors);
            });
        };
    }]
)

.directive('xpassionComment', function() {
    return {
        restrict: 'E',
        scope: {
            comment: '=comment',
            admin: '=?admin'
        },
        templateUrl: 'app/components/comment/directive.html',
        controller: ['$scope', 'Comment', function($scope, Comment) {
            $scope.trash = function(c) {
                c.deleted = true;
                c.$sremove().then(function(cr) {
                    //
                });
            };
            $scope.untrash = function(c) {
                c.deleted = false;
                c.$restore();
            };
        }]
    };
})
;