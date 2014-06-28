angular.module('creator.main', [
	'ui.router'
	])
.config(
	[
	'$stateProvider', '$urlRouterProvider',
	function ($stateProvider, $urlRouterProvider) {
		$stateProvider
		.state('main', {
			url: '/',
			templateUrl: '/views/main/main.html'
		})
	}
	]);