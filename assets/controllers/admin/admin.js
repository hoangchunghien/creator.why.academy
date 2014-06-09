/**
 * Created by Hien on 5/30/2014.
 */

angular.module('creator.admin', [
    'ui.router'
])
    .config(
    [
        '$stateProvider', '$urlRouterProvider',
        function ($stateProvider, $urlRouterProvider) {
            $stateProvider
                .state('admin', {
                    url: '/admin',
                    templateUrl: '/views/courses/courses.html'
                })
        }
    ]);