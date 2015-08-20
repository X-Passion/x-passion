'use strict';

angular.module('xpassion.issue', [])

.config(['$stateProvider', '$urlMatcherFactoryProvider', function($stateProvider, $urlMatcherFactoryProvider) {
    $stateProvider
        .state('index.issues', {
            url: "issues",
            abstract: true,
            template: "<ui-view />",
            controller: ['$scope', function($scope){
                $scope.infos.active = 'issues';
            }]
        })
            .state('index.issues.list', {
                url: "/list",
                templateUrl: "app/components/issues/list.html",
                controller: 'issues.ctrl.list',
                resolve: {
                    issues_list: ['Issue', function(Issue) {
                        return Issue.query();
                    }]
                }
            })
            .state('index.issues.details', {
                url: "/:id",
                templateUrl: "app/components/issues/details.html",
                controller: 'issues.ctrl.details',
                resolve: {
                    req_issue: ['Issue', '$stateParams', function(Issue, $stateParams) {
                        return Issue.get({id: $stateParams.id});
                    }]
                }
            })
    ;
}])

.controller('issues.ctrl.list', 
    ['$scope', 'issues_list', 
    function($scope, issues_list) {
        $scope.issues_list = issues_list;
        $scope.total = issues_list.length;
        $scope.p = {
            total: function() { return issues_list.length; },
            limit: 10,
            offset: 0
        };

        $scope.newer = function() {
            $scope.p.offset -= $scope.p.limit;
        };

        $scope.older = function() {
            $scope.p.offset += $scope.p.limit;
        };

        $scope.filterIssuesAdmin = function(o) {
            return o.published || $scope.isLoggedIn();
        };
    }]
)

.controller('issues.ctrl.details', 
    ['$scope', 'req_issue', 
    function($scope, req_issue) {
        $scope.issue = req_issue;
    }]
)

.directive('xpassionIssue', function() {
    return {
        restrict: 'E',
        scope: {
            issue: '=issue',
            admin: '=?admin'
        },
        templateUrl: 'app/components/issues/directive.html',
        controller: ['$scope', 'Issue', function($scope, Issue) {
            $scope.trash = function(i) {
                i.published = false;
                i.$sremove().then(function(ir) {
                    // console.log(ir);
                });
            };
            $scope.untrash = function(i) {
                i.published = true;
                i.$restore().then(function(ir) {
                    // console.log(ir);
                });
            };
        }]
    };
})

;