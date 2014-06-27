/**
 * Created by Hien on 5/30/2014.
 */

angular.module('creator.courses', [
    'ui.router',
    'creator.courses.service',
    'creator.courses.controller',
    'creator.lessons.controller'
])
    .config(
    [
        '$stateProvider', '$urlRouterProvider',
        function ($stateProvider, $urlRouterProvider) {
            $stateProvider
                .state('courses', {
                    abstract: true,
                    url: '/courses',
                    templateUrl: '/views/courses/courses.html'
                })
                .state('courses.list', {
                    parent: 'courses',
                    url: '',
                    resolve: {
                        courses: function (coursesSrv) {
                            return coursesSrv.findAll({
                                        query:{status:'10'},
                                        fields:{user:'id,name',parent:'id'},
                                        include:'parent'
                                    });
                        }
                    },
                    views: {
                        '@courses': {
                            templateUrl: '/views/courses/courses.list.html',
                            controller: 'creator.courses.list.ctrl'
                        }
                    }
                })

                .state('courses-detail', {
                    parent: 'courses',
                    url: '/{id:[0-9]*}',
                    templateUrl: '/views/courses/courses.detail.html',
                    resolve: {
                        course: function ($stateParams, coursesSrv) {
                            return coursesSrv.findById($stateParams.id, {include_contents:true, fields: {user: "id,name"}});
                        }
                    },
                    controller: 'creator.courses.detail.ctrl'
                })

                .state('courses-detail-contents', {
                    parent: 'courses-detail',
                    url: '/contents',
                    resolve: {
                        courses: function (course) {
                            console.log("courses-detail-contents resolving data...");
                            console.log(course);
                            return course.courses;
                        },
                        lessons: function(course) {
                            return course.lessons;
                        }
                    },
                    views: {
                        'courses@courses-detail': {
                            templateUrl: '/views/courses/courses.list.html',
                            controller: 'creator.courses.list.ctrl'
                        },
                        'lessons@courses-detail': {
                            templateUrl: '/views/lessons/lessons.list.html',
                            controller: 'lessons.list.ctrl'
                        }
                    }

                })
                .state('courses-detail-edit', {
                    parent: 'courses-detail',
                    url: '/edit',
                    views: {
                        '@courses': {
                            templateUrl: '/views/courses/course.editor.html',
                            controller: 'creator.courses.edit.ctrl'
                        }
                    }

                })

                .state('courses.new', {
                    parent: 'courses',
                    url: '/new',
                    resolve: {
                        course: function() {
                            return {};
                        }
                    },
                    views: {
                        '@courses': {
                            templateUrl: '/views/courses/course.editor.html',
                            controller: 'creator.courses.new.ctrl'
                        }
                    }
                })

                .state('courses-detail-lessons-add', {
                    parent: 'courses-detail-contents',
                    resolve: {
                        lesson: function(course) {
                            var lesson = {course_id: course.id};
                            return lesson;
                        }
                    },
                    views: {
                        '@courses': {
                            templateUrl: '/views/lessons/lesson.editor.html'
                            ,controller: 'lessons.new.ctrl'
                        }
                    }
                })

                .state('courses-detail-courses-add', {
                    parent: 'courses-detail-contents',
                    resolve: {
                        course: function(course) {
                            console.log(course);
                            return {parent:{id:course.id}};
                        }
                    },
                    views: {
                        '@courses': {
                            templateUrl: '/views/courses/course.editor.html',
                            controller: 'creator.courses.new.ctrl'
                        }
                    }
                })

                .state('courses-detail-contents-add', {
                    parent: 'courses-detail-contents',
                    url: '/add',
//                    resolve: {
//                        course: function ($stateParams, coursesSrv) {
//                            console.log("Resolving...");
//                            return coursesSrv.findById($stateParams.id, {include_contents:true});
//                        }
//                    },
                    views: {
                        '@courses': {
                            controller: function ($state, course) {
                                console.log("courses-detail-contents-state");
                                if (course.content_type === "lesson") {
                                    $state.go('courses-detail-lessons-add', {},
                                        {location: false, inherit: true, relative: $state.$current, notify: true }
                                    );
                                }
                                else if (course.content_type === "course") {
                                    $state.go('courses-detail-courses-add', {},
                                        {location: false, inherit: true, relative: $state.$current, notify: true }
                                    );
                                }
                            }
                        }
                    }
                });
        }
    ]
)
;