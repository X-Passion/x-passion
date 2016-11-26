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
            .state('index.issues.article', {
                url: "/article/:id",
                templateUrl: "app/components/issues/article-details.html",
                controller: 'articles.ctrl.details',
                resolve: {
                    req_article: ['Article', '$stateParams', function(Article, $stateParams) {
                        return Article.get({id: $stateParams.id});
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
            limit: 8,
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
    ['$scope', 'req_issue', 'Issue', '$stateParams',
    function($scope, req_issue, Issue, $stateParams) {
        Issue.get({id: $stateParams.id}).$promise.then(function(issue) {
            $scope.issue = issue;
            $scope.issue.items = [];
            var features = {};
            _.forEach($scope.issue.articles, function(a) {
                if (a.feature === null) {
                    $scope.issue.items.push({'rank': a.begin_page, 'type': 'article', 'obj': a});
                } else {
                    if (a.feature in features) {
                        features[a.feature].articles.push(a);
                        //$scope.issue.items[$scope.issue.items.length - 1].obj.articles.push(a);
                    } else {
                        var feature = _.find($scope.issue.features, function(f) {
                            return f.id == a.feature;
                        });
                        feature.articles = [a];
                        features[feature.id] = feature;
                        $scope.issue.items.push({'rank': a.begin_page, 'type': 'feature', 'obj': feature});
                    }
                    a.feature = features[a.feature];
                }
            });
            $scope.features = features;
            console.log($scope.issue);
        });
    }]
)

.controller('articles.ctrl.details',
    ['$scope', 'req_article', 'Article', '$stateParams',
    function($scope, req_article, Article, $stateParams) {
        Article.get({id: $stateParams.id}).$promise.then(function(article) {
            $scope.article = article;
            console.log($scope.article);
        });
    }]
)

.directive('xpassionIssue', function() {
    return {
        restrict: 'E',
        scope: {
            issue: '=issue',
            admin: '=?admin'
        },
        templateUrl: 'app/components/issues/issue-directive.html',
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

.directive('xpassionFeature', function() {
    return {
        restrict: 'E',
        scope: {
            feature: '=feature',
            admin: '=?admin'
        },
        templateUrl: 'app/components/issues/feature-directive.html',
        controller: ['$scope', 'Feature', function($scope, Feature) {
            //
        }]
    };
})

.directive('xpassionArticle', function() {
    return {
        restrict: 'E',
        scope: {
            article: '=article',
            admin: '=?admin'
        },
        templateUrl: 'app/components/issues/article-directive.html',
        controller: ['$scope', 'Article', function($scope, Article) {
            $scope.bg_color = function(c) {
                return 'linear-gradient(to right, rgba(1,0,255,0), rgba(0,255,0,0))';
            };
        }]
    };
})

;
