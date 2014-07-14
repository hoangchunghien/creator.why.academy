/**
 * Created by Hien on 5/30/2014.
 */

angular.module('creator.admin', [
    'ui.router',
    'creator.courses.service',
    'creator.navigation.ancestors.controller'
])
    .config(
    [
        '$stateProvider', '$urlRouterProvider',
        function ($stateProvider, $urlRouterProvider) {
            $stateProvider
                .state('admin', {
                    abstract: true,
                    url: '/admin',
                    templateUrl: '/views/admin/admin.html'
                })
                .state('admin-courses', {
                    parent: 'admin',
                    url: '/courses',
                    resolve: {
                        courses: function (coursesSrv) {
                            return coursesSrv.findAll({
                                query:{status:'1,2,3,4,5,6,7,8,9,10,11,12,13'},
                                fields:{
                                    user:'id,name',
                                    parent:'id',
                                    '': 'id,name,picture_url,content_type,description,status'
                                },
                                include:'parent',
                                sort: {'': 'created_at'}
                            });
                        },
                        showActionBar: function() {
                            return true;
                        },
                        showAuthor: function() {
                            return true;
                        },
                        showOrder: function() {
                            return false;
                        }
                    },
                    views: {
                        'content@admin': {
                            templateUrl: '/views/admin/admin.courses.list.html',
                            controller: 'creator.admin.courses.list.ctrl'
                        }
                    }
                })
                .state('admin-courses-detail', {
                    parent: 'admin-courses'
                    ,abstract: true
                    ,url: '/{id:[0-9]*}'
                    ,views: {
                        'content@admin': {
                            templateUrl: '/views/admin/admin.course.detail.html'
                        }
                        ,'navigator@admin': {
                            templateUrl: '/views/admin/admin.ancestors-navigator.html',
                            controller: 'creator.navigation.ancestors.ctrl'
                        }
                    }
                    ,resolve: {
                        course: function ($stateParams, coursesSrv) {
                            return coursesSrv.findById($stateParams.id,
                                {
                                    include_contents: true,
                                    fields: {user: "id,name"},
                                    sort: {lessons: "-created_at", courses: 'order_number'}
                                }
                            );
                        },
                        ancestors: function ($stateParams, coursesSrv) {
                            return coursesSrv.findAncestors($stateParams.id);
                        },
                        root: function (ancestors, coursesSrv) {
                            var ancArr = coursesSrv.ancestorsToArray(ancestors);
                            var root;
                            if (ancArr.length > 0) {
                                root = ancArr[0];
                            }
                            return root;
                        },
                        descendants: function (root, coursesSrv) {
//                            var ancArr = coursesSrv.ancestorsToArray(ancestors);
//                            if (ancArr.length > 0) {
//                                var root = ancArr[0];
                            if (root) {
                                return coursesSrv.findDescendants(root.id);
                            }
                            return [];
                        },
                        showCurrentCourseInNavigator: function () {
                            return false;
                        },
                        showAuthor: function() {
                            return false;
                        },
                        showOrder: function() {
                            return true;
                        }
                    }
                })

                .state('admin-courses-detail-contents', {
                    parent: 'admin-courses-detail',
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
                        lessons: function (course) {
                            if (course.content_type == 'lesson') {
                                course.numOfItems = course.lessons.length;
                            }
                            return course.lessons;
                        },
                        showActionBar: function () {
                            return true;
                        }
                    },
                    views: {
                        'detail@admin-courses-detail': {
                            templateUrl: '/views/admin/admin.course.html',
                            controller: 'creator.admin.course.detail.ctrl'
                        }
                        ,'courses@admin-courses-detail': {
                            templateUrl: '/views/admin/admin.courses.list.html',
                            controller: 'creator.admin.courses.list.ctrl'
                        }
                        ,'lessons@admin-courses-detail': {
                            templateUrl: '/views/admin/admin.lessons.list.html',
                            controller: 'creator.admin.lessons.list.ctrl'
                        }
                    }
                })
        }
    ]);