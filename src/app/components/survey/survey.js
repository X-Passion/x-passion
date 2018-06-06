'use strict';

angular.module('xpassion.survey', ['schemaForm'])

.config(['$stateProvider', function($stateProvider) {
	// Tries to get the active survey, then
	//  Unauthenticated -> suggest to login
	//  Forbidden -> error message
	//  Not found -> error message
	//  Ok -> disclaimers and proceed btn
	$stateProvider
		.state('index.survey', {
			url: 'sondage/',
			templateUrl: 'app/components/survey/intro.html',
			controller: 'survey.ctrl.intro',
		})
		.state('index.survey.answer', {
			url: 'repondre',
			template: '<xpassion:survey survey="survey" on-finish="onFinish">',
			controller: 'survey.ctrl.answer',
		})
	;
}])

.controller('survey.ctrl.intro', ['$scope', '$state', '$document', 'AuthService', 'API', 'Survey', function($scope, $state, $document, AuthService, API, Survey) {
	$scope.infos.active = 'survey';
	$scope.frankizUrl = 'https://cas.binets.fr/login?service=' + encodeURIComponent(
		API.route('api-brcas-token-auth/?next=' + encodeURIComponent(
			$document[0].URL
		)));
	$scope.surveyStatus = 0;
	$scope.onFinish = function() {
		$scope.surveyStatus = 201;
		$state.go('index.survey');
	};

	AuthService.ready().then(function() {
		$scope.survey = Survey.get({}, function(value, responseHeaders) {
			$scope.surveyStatus = 200;
			return value;
		}, function(response) {
			$scope.surveyStatus = response.status;
		});
	});
}])

.controller('survey.ctrl.answer', ['$scope', '$state',
	function($scope, $state) {
		if($scope.surveyStatus !== 200) {
			$state.go('index.survey');
		}
}])

.controller('survey.ctrl.body', ['$scope', 'SurveyPage', function($scope, SurveyPage) {
	$scope.pages = [];
	$scope.toPage = function(pageNr) {
		var id = $scope.survey.page_set[pageNr];
		if(!id) {
			$scope.onFinish();
			return;
		}
		($scope.nextPage = $scope.pages[pageNr] || SurveyPage.get({id: id}))
			.$promise.then(function() {
				$scope.nextPage.id = id;
				$scope.activePage = $scope.nextPage;
				$scope.pages[pageNr] = $scope.activePage;
				$scope.pageNr = pageNr;
			});
	};
	$scope.toNextPage = function() {
		$scope.toPage($scope.pageNr + 1);
	};
		

	$scope.submit = function(form) {
		$scope.$broadcast('schemaFormValidate');

		if (form.$valid) {
			$scope.activePage.$answer();
			$scope.toNextPage();
		}
	};
	$scope.previous = function() {
		if($scope.pageNr > 0) {
			$scope.toPage($scope.pageNr - 1);
		}
	};

	if($scope.survey) {
		$scope.toPage(0);
	}


}])

.directive('xpassionSurvey', function() {
	return {
		scope: {
			survey: '=survey',
			onFinish: '=onFinish',
		},
		controller: 'survey.ctrl.body',
		templateUrl: 'app/components/survey/body.html',
	};
})
;
