'use strict';

angular.module('xpassion.api', [
    'ngResource'
])

.factory('API', ['$location',
    function ($location) {
        return {
            route: function (path) {
                /*if (/localhost/.test($location.absUrl())) {
                    return 'http://127.0.0.1:8000' + (path == '' ? '' : '/' + path);
                } else {
                    return 'api' + (path == '' ? '' : '/' + path);
                }*/
                return 'https://api.x-passion.binets.fr' + (path ? '/' + path : '');
            }
        };
    }
])

.factory('Comment', ['API', '$resource',
    function(API, $resource) {
        return $resource(API.route('comments/:id/'), {id: '@id'}, {
            sremove: {method: 'PUT', url: API.route('comments/:id/remove/')},
            restore: {method: 'PUT', url: API.route('comments/:id/restore/')},
        }, {stripTrailingSlashes: false});
    }]
)

.factory('News', ['API', '$resource',
    function(API, $resource) {
        return $resource(API.route('news/:id/'), {id: '@id'}, {
            update: {method: 'PUT', url: API.route('news/:id/')},
            sremove: {method: 'PUT', url: API.route('news/:id/remove/')},
            restore: {method: 'PUT', url: API.route('news/:id/restore/')}
        }, {stripTrailingSlashes: false});
    }]
)

.factory('Issue', ['API', '$resource',
    function(API, $resource) {
        return $resource(API.route('issues/:id/'), {id: '@id'}, {
            update: {method: 'PUT', url: API.route('issues/:id/')},
            sremove: {method: 'PUT', url: API.route('issues/:id/unpublish/')},
            restore: {method: 'PUT', url: API.route('issues/:id/publish/')}
        }, {stripTrailingSlashes: false});
    }]
)

.factory('Feature', ['API', '$resource',
    function(API, $resource) {
        return $resource(API.route('feature/:id/'), {id: '@id'}, {
            update: {method: 'PUT', url: API.route('feature/:id/')}
        }, {stripTrailingSlashes: false});
    }]
)

.factory('Article', ['API', '$resource',
    function(API, $resource) {
        return $resource(API.route('articles/:id/'), {id: '@id'}, {
            update: {method: 'PUT', url: API.route('articles/:id/')}
        }, {stripTrailingSlashes: false});
    }]
)

.factory('Survey', ['API', '$resource',
	function(API, $resource) {
		return $resource(API.route('survey/current'), {}, {
		}, {stripTrailingSlashes: false});
	}]
)

.factory('SurveyPage', ['API', '$resource', '$http',
	function(API, $resource, $http) {
		return $resource(API.route('page_form/:id/'), {id: '@id'}, {
			get: {method: 'GET', transformResponse: []
				.concat($http.defaults.transformResponse)
				.concat(function(value) {
					return {
						schema: value,
						form:  ["*"],
						model: {}
					};
				})
			},
			answer: {method: 'POST', url: API.route('page_form/:id/answer/'), transformRequest : []
				.concat(function(value) {
					return value.model;
				})
				.concat($http.defaults.transformRequest)
			}
		}, {stripTrailingSlashes: false});
	}]
)
;
