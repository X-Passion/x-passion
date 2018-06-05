'use strict';

angular.module('xpassion.survey', [])

.config(['$stateProvider', function($stateProvider) {
	// Tries to get the active survey, then
	//  Unauthenticated -> suggest to login
	//  Forbidden -> error message
	//  Not found -> error message
	//  Ok -> disclaimers and proceed btn
	$stateProvider
		.state('index.survey', {
			url: 'sondage',
			templateUrl: 'app/components/survey/intro.html',
			controller: 'survey.ctrl.intro',
		})
		.state('index.survey.body', {
			url: 'sondage/repondre',
			template: '<xpassion:survey />',
			controller: ['$scope', function($scope) {
			}]
		})
	;
}])

.controller('survey.ctrl.intro', ['$scope', '$document', 'AuthService', 'API', 'Survey', function($scope, $document, AuthService, API, Survey) {
	$scope.infos.active = 'survey';
	$scope.frankizUrl = 'https://cas.binets.fr/login?service=' + encodeURIComponent(
		API.route('api-brcas-token-auth/?next=' + encodeURIComponent(
			$document[0].URL
		)));
	$scope.surveyStatus = 0;
	AuthService.ready().then(function() {
		$scope.survey = Survey.get({}, function(value, responseHeaders) {
			$scope.surveyStatus = 200;
		}, function(response) {
			$scope.surveyStatus = response.status;
		});
	});
}])

.controller('survey.ctrl.body', ['$scope', function($scope) {
}])

.directive('xpassionSurvey', ['', function() {
	return {
		controller: 'survey.ctrl.body',
		templateUrl: 'app/components/survey/body.html',
	};
}])
;
