/**
 * Created by Hien on 7/7/2014.
 */
angular.module('creator.navigation.ancestors.controller', [
    'ui.router'
    ,'creator.courses.service'
])
    .controller('creator.navigation.ancestors.ctrl', function($scope, $http, ancestors, course, coursesSrv) {
        $scope.ancestors = coursesSrv.ancestorsToArray(ancestors);
        $scope.ancestors.push(course);
    });