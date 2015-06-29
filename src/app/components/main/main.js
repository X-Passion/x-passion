'use strict';

angular.module('xpassion.main', [
    //
])

.config(['$stateProvider', '$urlMatcherFactoryProvider', 
    function($stateProvider, $urlMatcherFactoryProvider) {
    //$urlMatcherFactoryProvider.strictMode(false);
    $stateProvider
        .state('index', {
            url: "/",
            views: {
                '@': {
                    templateUrl: "app/components/main/layout.html",
                    controller: 'main.ctrl.base'
                },
                'header@index': {
                    templateUrl: "app/components/main/header.html",
                    controller: 'main.ctrl.header'
                },
                '@index': {
                    templateUrl: "app/components/main/home.html",
                    controller: 'main.ctrl.home'
                }
            }
        })
        .state('index.presentation', {
            url: "presentation",
            templateUrl: "app/components/static/presentation.html",
            controller: ['$scope', function($scope) {
                $scope.infos.active = 'presentation';
            }]
        })
        
        .state('index.forgot-password', {
            url: "forgot-password",
            templateUrl: "app/components/auth/forgot-password.html",
            controller: 'main.ctrl.forgot_pwd'
        })
        .state('index.contact', {
            url: "contact",
            templateUrl: "app/components/static/contact.html",
            controller: ['$scope', function($scope){
                $scope.infos.active = 'contact';
            }]
        })
        .state('index.entreprises', {
            url: "entreprises",
            templateUrl: "app/components/static/entreprises.html",
            controller: ['$scope', function($scope){
                $scope.infos.active = 'entreprises';
            }]
        })
        .state('index.ecrire', {
            url: "ecrire",
            templateUrl: "app/components/static/ecrire.html",
            controller: ['$scope', function($scope){
                $scope.infos.active = 'ecrire';
            }]
        })
        // .state('index.gallery', {
        //     url: "gallery",
        //     templateUrl: "components/static/gallery.html",
        //     controller: ['$scope', 'Gallery', function($scope, Gallery) {
        //         $scope.infos.active = 'gallery';
        //         $scope.images = Gallery.query();
        //         $scope.openGallery = function(i) {
        //             var gallery = blueimp.Gallery($scope.images, { index: i });
        //         };
        //     }]
        // })
        .state('index.404', {
            url: "404",
            templateUrl: "app/components/static/404.html",
            controller: ['$scope', '$timeout', '$state', function($scope, $timeout, $state) {
                $scope.infos.active = '';
                // $timeout(function() {
                //     $state.go('index.presentation')
                // }, 3500);
            }]
        })
    ;
}])

.controller('main.ctrl.base',
    ['$scope', '$stateParams', 'AuthService', '$state', '$modal', 
    function($scope, $stateParams, AuthService, $state, $modal) {
        $scope.infos = {
            active: 'index',
            user: AuthService.getUser()
        };
        $scope.isLoggedIn = function() {
            return AuthService.isAuthenticated();
        };
        $scope.logout = function() {
            $scope.infos.user = null;
            AuthService.logout();
            $state.go('index');
        };


        $scope.loginOpen = function(size) {
            var modalInstance = $modal.open({
                templateUrl: "app/components/auth/login.html",
                controller: 'main.ctrl.login',
                size: size
            });

            modalInstance.result.then(function (user) {
                $scope.infos.user = user;
            });
        };
    }]
)

.controller(
    'main.ctrl.header',
    ['$scope', 'AuthService', 
    function($scope, AuthService) {
        //
    }]
)

.controller('main.ctrl.home', 
    ['$scope', '$state',
    function($scope, $state) {
        $scope.infos.active = '';
    }]
)

.controller('main.ctrl.login', 
    ['$scope', 'AuthService', '$modalInstance', '$state', '$timeout', 
    function($scope, AuthService, $modalInstance, $state, $timeout){
        $scope.login = {
            username: '',
            password: ''
        };

        $timeout(function () {
            document.getElementById("usernameInput").focus();
        }, 300);

        $scope.alerts = [];

        $scope.closeAlert = function(index) {
            $scope.alerts.splice(index, 1);
        };

        $scope.connexion = function (login) {
            $scope.loginError = false;
            $scope.inLogin = true;
            AuthService.login(login).then(
                function(user) {
                    $scope.login = {username: '', password: ''};
                    //$scope.infos.user = AuthService.getUser();
                    $scope.inLogin = false;
                    $modalInstance.close(user);
                }, function(error) {
                    $scope.loginError = true;
                    $scope.alerts.push({type: 'danger', msg: 'Echec de l\'authentification.'});
                    $scope.login.password = '';
                    $scope.inLogin = false;
                }
            );
        };

        $scope.cancel = function(dest) {
            $modalInstance.dismiss('cancel');
            if (dest == 'forgot') {
                $state.go('index.forgot-password');
            }
        }
    }]
)

.controller('main.ctrl.forgot_pwd',
    ['$scope', 'User', 
    function($scope, User) {
        $scope.infos.active = '';

        $scope.generatePwd = function() {
            User.forgot_password({email: $scope.uemail}).$promise.then(function(res) {
                console.log(res);
            }, function(error) {
                console.log(error);
            });
        };
    }]
)
;
