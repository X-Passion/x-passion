'use strict';

angular.module('xpassion', [
    'angularMoment',
    'ngAnimate', 
    'ngCookies', 
    'ngTouch', 
    'ngSanitize', 
    'ngResource', 
    'ui.router', 
    'ui.bootstrap',
    'angularFileUpload',

    'xpassion.auth',
    'xpassion.api',
    
    'xpassion.main',
    'xpassion.comment',
    'xpassion.news',
    'xpassion.issue', 
])

.factory('http.request.interceptor', 
    ['$q', '$location',
    function ($q, $location) {
        return {
            'responseError': function(rejection) {
                // do something on error
                if(rejection.status === 404){
                    $location.path('/404');                    
                }
                return $q.reject(rejection);
             }
         };
    }]
)

.config(['$urlRouterProvider',
    function($urlRouterProvider) {
        $urlRouterProvider.otherwise('/');
    }]
)

.config(['$httpProvider',
    function ($httpProvider) {
        $httpProvider.interceptors.push('auth.interceptor');
        $httpProvider.interceptors.push('http.request.interceptor');
    }]
)

.directive('ngThumb', ['$window', function($window) {
    var helper = {
        support: !!($window.FileReader && $window.CanvasRenderingContext2D),
        isFile: function(item) {
            return angular.isObject(item) && item instanceof $window.File;
        },
        isImage: function(file) {
            var type =  '|' + file.type.slice(file.type.lastIndexOf('/') + 1) + '|';
            return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
        }
    };

    return {
        restrict: 'A',
        template: '<canvas/>',
        link: function(scope, element, attributes) {
            if (!helper.support) return;

            var params = scope.$eval(attributes.ngThumb);

            if (!helper.isFile(params.file)) return;
            if (!helper.isImage(params.file)) return;

            var canvas = element.find('canvas');
            var reader = new FileReader();

            reader.onload = onLoadFile;
            reader.readAsDataURL(params.file);

            function onLoadFile(event) {
                var img = new Image();
                img.onload = onLoadImage;
                img.src = event.target.result;
            }

            function onLoadImage() {
                var width = params.width || this.width / this.height * params.height;
                var height = params.height || this.height / this.width * params.width;
                canvas.attr({ width: width, height: height });
                canvas[0].getContext('2d').drawImage(this, 0, 0, width, height);
            }
        }
    };
}])

.filter('nl2br', function(){
      return function(text) {
           return text ? text.replace(/\n/g, '<br/>') : '';
      };
})

.run(['amMoment', '$rootScope',
    function(amMoment, $rootScope) {
        moment.locale('fr', {
            calendar : {
                lastDay : '[Hier]',
                sameDay : "[Aujourd'hui]",
                nextDay : '[Demain]',
                lastWeek : 'dddd [dernier]',
                nextWeek : 'dddd [prochain]',
                sameElse : 'L'
            }
        });
        amMoment.changeLocale('fr');
    }
])

.constant('angularMomentConfig', {
    timezone: 'Europe/Paris' // e.g. 'Europe/London'
})
;
