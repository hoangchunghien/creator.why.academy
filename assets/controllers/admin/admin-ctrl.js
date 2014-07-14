/**
 * Created by hoang_000 on 7/14/2014.
 */

angular.module('creator.admin.controller', [
    'creator.api.service',
    'creator.courses.service'
])
    .controller('creator.admin.course.detail.ctrl', function(Seo, $scope, $state, course) {
        Seo.title = course.name;
        console.log("STATE DETAIL");
        $scope.course = course;
    })

    .controller('creator.admin.courses.list.ctrl', function($scope, $state, courses, showActionBar) {
        $scope.courses = courses;
    })

    .controller('creator.admin.lessons.list.ctrl', function($scope, $state, lessons, showActionBar) {
        $scope.lessons = lessons;
    });