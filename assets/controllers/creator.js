/**
 * Created by Hien on 5/30/2014.
 */

 angular.module('creator', [
    'creator.main',
    'creator.api.service',
    'creator.utils.service',
    'creator.users',
    'creator.users.service',
    'creator.navigation.controller',
    'creator.lessons',
    'creator.lessons.service',
    'creator.courses',
    'creator.courses.service',
    'creator.pictures.directive',
    'ui.router'
    ]).factory('Seo', function(){
        return {
            title: 'This is the title'
        };
    })
 .run(
    ['Seo',          '$rootScope', '$state', '$stateParams',
    function (Seo, $rootScope, $state, $stateParams) {
        $rootScope.Seo = Seo;
            // It's very handy to add references to $state and $stateParams to the $rootScope
            // so that you can access them from any scope within your applications.For example,
            // <li ui-sref-active="active }"> will set the <li> // to active whenever
            // 'contacts.list' or one of its decendents is active.
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
        }
        ]
        )
 .config([
    '$stateProvider', '$urlRouterProvider', '$locationProvider',
    function ($stateProvider, $urlRouterProvider, $locationProvider) {
        $locationProvider.html5Mode(true);
    }
    ]
    );