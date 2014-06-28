/**
 * Created by Hien on 5/30/2014.
 */

 angular.module('creator.lessons', [
    'ui.router',
    'creator.lessons.controller',
    'creator.lessons.service'
    ])
 .config(
    [
    '$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {
        $stateProvider
        .state('lessons', {
            abstract: true,
            url: '/lessons',
            templateUrl: '/views/lessons/lessons.html'
        })
        .state('lessons-detail', {
            parent: 'lessons',
            url: '/{id:[0-9]*}',
            resolve: {
                lesson: function($stateParams, lessonsSrv) {
                    console.log(lessonsSrv);
                    return lessonsSrv.findById($stateParams.id);
                }
            },
            templateUrl: '/views/lessons/lessons.detail.html'
        })
        .state('lessons-detail-edit', {
            parent: 'lessons-detail',
            url: '/edit',
            templateUrl: '/views/lessons/lesson.editor.html',
            controller: 'lessons.detail.edit.ctrl'

        })
    }
    ]);
