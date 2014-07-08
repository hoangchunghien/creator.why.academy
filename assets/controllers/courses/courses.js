/**
 * Created by Hien on 5/30/2014.
 */

angular.module('creator.courses', [
    'ui.router',
    'creator.courses.service',
    'creator.courses.controller',
    'creator.lessons.controller',
    'creator.navigation.ancestors.controller'
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
                    abstract: true,
                    url: '/{id:[0-9]*}',
                    views: {
                        '@courses': {
                            templateUrl: '/views/courses/courses.detail.html'
                        },
                        'navigator@courses': {
                            templateUrl: '/views/navigation/ancestors-navigator.html',
                            controller: 'creator.navigation.ancestors.ctrl'
                        }
                    }
                    ,resolve: {
                        course: function ($stateParams, coursesSrv) {
                            return coursesSrv.findById($stateParams.id, 
                                    {include_contents:true, fields: {user: "id,name"}, sort: {lessons: "-created_at"}}
                                );
                        },
                        ancestors: function ($stateParams, coursesSrv) {
                            return coursesSrv.findAncestors($stateParams.id);
                        },
                        root: function(ancestors, coursesSrv) {
                            var ancArr = coursesSrv.ancestorsToArray(ancestors);
                            var root;
                            if (ancArr.length > 0) {
                                root = ancArr[0];
                            }
                            return root;
                        },
                        descendants: function(root, coursesSrv) {
//                            var ancArr = coursesSrv.ancestorsToArray(ancestors);
//                            if (ancArr.length > 0) {
//                                var root = ancArr[0];
                            if (root) {
                                return coursesSrv.findDescendants(root.id);
                            }
                            return [];
                        },
                        showCurrentCourseInNavigator: function() {
                            return false;
                        }
                    }
                    // ,controller: 'creator.courses.detail.ctrl'
                })

                .state('courses-detail-contents', {
                    parent: 'courses-detail',
                    url: '',
                    resolve: {
                        courses: function (course) {
                            console.log("courses-detail-contents resolving data...");
                            console.log(course);
                            if (course.content_type == 'course') {
                                course.numOfItems = course.courses.length;
                            }
                            return course.courses;
                        },
                        lessons: function(course) {
                            if (course.content_type == 'lesson') {
                                course.numOfItems = course.lessons.length;
                            }
                            return course.lessons;
                        }
                    },
                    views: {
                        'detail@courses-detail': {
                            templateUrl: '/views/courses/course.html',
                            controller: 'creator.courses.detail.ctrl'
                        }
                        ,'courses@courses-detail': {
                            templateUrl: '/views/courses/courses.list.html',
                            controller: 'creator.courses.list.ctrl'
                        }
                        ,'lessons@courses-detail': {
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