/**
 * Created by Hien on 7/7/2014.
 */
angular.module('creator.navigation.ancestors.controller', [
    'ui.router'
])
    .controller('creator.navigation.ancestors.ctrl', function($scope, $http, ancestors, course) {
        $scope.ancestors = [];
        var i = 0;
        if (ancestors.id) {
            $scope.ancestors[i++] = {id: ancestors.id, name: ancestors.name};
            var parent = ancestors.parent;
            while (parent) {
                $scope.ancestors[i++] = {id: ancestors.id, name: ancestors.name};
                parent = parent.parent;
            }
        }
        $scope.ancestors[i++] = course;
    });