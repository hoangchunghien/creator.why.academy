/**
 * Created by Hien on 5/30/2014.
 */

angular.module('creator.users', [
    'ui.router',
    'creator.courses.controller',
    'creator.courses.service',
    'ngCookies'
])
    .config([
        '$stateProvider', '$urlRouterProvider',
        function ($stateProvider,   $urlRouterProvider) {
            $stateProvider
                .state('users',{
                    url: '/users',
                    templateUrl: '/views/users/users.html'
                })
                .state('users.detail', {
                    parent: 'users',
                    url: '/{userId:[0-9]*}',
                    templateUrl: '/views/users/users.detail.html'
                })
                .state('users.detail.courses',{
                    parent: 'users.detail',
                    url: '/courses',
                    resolve: {
                        courses: function ($stateParams, coursesSrv) {
                            return coursesSrv.findAll(
                                {
                                    query:{user:{id:$stateParams.userId}, 'status': '1,2,3,4,5,6,7,8,9,10,11,12,13'},
                                    fields:{user:'id,name',parent:'id'},
                                    include:'parent'
                                }
                            );
                        },
                        showActionBar: function() {
                            return false;
                        }
                    },
                    views: {
                        '@users': {
                            templateUrl: '/views/courses/courses.list.html',
                            controller: 'creator.courses.list.ctrl'
                        }
                    }
                });
        }
    ]);
