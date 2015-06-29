'use strict';

angular.module('xpassion.api', [
    'ngResource'
])

.factory('API', ['$location', 
    function ($location) {
        return { 
            route: function (path) {
                if (/localhost/.test($location.absUrl())) {
                    return 'http://localhost/~camille/x-passion-api/index.php' + (path == '' ? '' : '/' + path);
                } else {
                    return 'api/index.php' + (path == '' ? '' : '/' + path);
                }
            }
        };
    }
])

.factory('User', ['API', '$resource', 
    function(API, $resource) {
        return $resource(API.route('users/:id'), {id: '@id'}, {
            enable: {method: 'PUT', url: API.route('users/enable/:id')},
            disable: {method: 'PUT', url: API.route('users/disable/:id')},
            change_password: {method: 'PUT', url: API.route('users/change-password')},
            forgot_password: {method: 'PUT', url: API.route('users/forgot-password')},
            update: {method: 'PUT', url: API.route('users/:id')}
        }, {stripTrailingSlashes: false});
    }]
)
;
