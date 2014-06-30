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
			templateUrl: '/views/main/main.html',
			controller: 'creator.main.ctrl'
		})
	}
	]).controller('creator.main.ctrl', function(Seo){
		Seo.title = "Author for Apo";
	});