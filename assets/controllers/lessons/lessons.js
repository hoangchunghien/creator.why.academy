/**
 * Created by Hien on 5/30/2014.
 */

 angular.module('creator.lessons', [
    'ui.router',
    'creator.lessons.controller',
    'creator.navigation.ancestors.controller',
    'creator.courses.service',
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
                },
                course: function(lesson, coursesSrv) {
                    return coursesSrv.findById(lesson.course_id);
                },
                ancestors: function (lesson, coursesSrv) {
                    return coursesSrv.findAncestors(lesson.course_id);
                },
                showCurrentCourseInNavigator: function() {
                    return true;
                }
            },
            views: {
                '@lessons': {
                    templateUrl: '/views/lessons/lessons.detail.html'
                },
                'navigator@lessons': {
                    templateUrl: '/views/navigation/ancestors-navigator.html',
                    controller: 'creator.navigation.ancestors.ctrl'
                }
            }

        })
        .state('lessons-detail-edit', {
            parent: 'lessons-detail',
            url: '/edit',
            views: {
                '@lessons': {
                    templateUrl: '/views/lessons/lesson.editor.html',
                    controller: 'lessons.detail.edit.ctrl'
                }
            }
        })
    }
    ]);
