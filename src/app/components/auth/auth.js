'use strict';

angular.module('xpassion.auth', [
    'ngStorage',
    'xpassion.api'
])

.factory('AuthService', ['$injector', '$localStorage', '$q', 'API', '$location', '$rootScope', 
    function ($injector, $localStorage, $q, API, $location, $rootScope) {
        if ($localStorage.auth === undefined) {
            $localStorage.auth = {
                token: null,
                user: null
            };
        }
        return {
            login: function(credentials, resultLogin) {
                return $injector.get('$http').post(API.route('users/login'), credentials).then(
                    function(response) {
                        $localStorage.auth.token = response.data.token;
                        $localStorage.auth.user = response.data.user;
                        $location.path('/');
                        return response.data.user;
                    },
                    function(response) {
                        $localStorage.auth.token = null;
                        $localStorage.auth.user = null;
                        //$location.path('/login');
                        return $q.reject();
                    });
            },
            logout: function() {
                $localStorage.auth.token = null;
                $localStorage.auth.user = null;
            },
            isAuthenticated: function() {
                return $localStorage.auth.token != null;
            },
            getToken: function() {
                return $localStorage.auth.token;
            },
            getUser: function() {
                return $localStorage.auth.user;
            }
        };
    }
])
.factory('auth.interceptor', ['AuthService', '$q', '$location', 
    function (AuthService, $q, $location) {
        return {
            request: function(config) {
                // config.headers = config.headers || {};
                // if (AuthService.isAuthenticated()) {
                //  config.headers.Authorization = 'Bearer ' + AuthService.getToken();
                // }

                config.params = config.params || {};
                // to improve: necessary for ui.bootstrap ; and the token is useless for static files
                if (AuthService.isAuthenticated() && /api\//.test(config.url)) {
                    config.headers["_token"] = AuthService.getToken();
                }
                return config || $q.when(config);
            },
            response: function(response) {
                if (response.status === 401) {
                    //AuthService.logout();
                    $state.go('index.login');
                }
                return response || $q.when(response);
            },
            responseError: function(response) {
                if (response.status === 401) {
                    AuthService.logout();
                }
                return $q.reject(response);
            }
        };
    }
]);
