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

    .controller('creator.admin.courses.list.ctrl', function($scope, $state, courses, coursesSrv, showActionBar, showAuthor, showOrder) {
        $scope.courses = courses;
        $scope.show = {};
        $scope.show.author = showAuthor;
        $scope.show.order = showOrder;
        $scope.show.actionBar = showActionBar;
        $scope.status = [
            {'text': 'Prepare for creating', 'value': 1},
            {'text': 'Waiting for creating', 'value': 2},
            {'text': 'Creation received', 'value': 3},
            {'text': 'Waiting for review', 'value': 4},
            {'text': 'In review', 'value': 5},
            {'text': 'Pending contract', 'value': 6},
            {'text': 'Pending creator release', 'value': 7},
            {'text': 'Pending store release', 'value': 8},
            {'text': 'Processing for store', 'value': 9},
            {'text': 'Ready for sale', 'value': 10},
            {'text': 'Rejected', 'value': 11},
            {'text': 'Removed from sale', 'value': 12}
        ];
        $scope.slStatus = $scope.status[0];

        $scope.getStatusStyle = function (status) {
            var style = {};
            style['font-weight'] = 'bold';
            switch (status) {
                case 10:
                    style.color = "green";
                    break;
                default:
                    style.color = "orange";
                    break;
            }
            return style;
        };

        $scope.changeSelectedCoursesStatus = function() {
            var patches = [];
            var updatePath = "/";
            var index = 0;
            var changedCourses = [];
            for (var i in courses) {
                var course = courses[i];
                if (course.checked && course.status != $scope.slStatus.value) {
                    updatePath += course.id + ",";
                    var patch = {op: 'replace', path: '/courses/'+ index++ +"/status", value: $scope.slStatus.value};
                    patches.push(patch);
                    changedCourses.push(course);
                }
            }
            if (patches.length > 0) {
                updatePath = updatePath.slice(0, -1);
                coursesSrv.update(patches, updatePath,
                    function(progress) {
                        console.log("Saving changed...");
                    },
                    function(success) {
                        for (var i in changedCourses) {
                            var course = changedCourses[i];
                            course.status = $scope.slStatus.value;
                            course.status_name = $scope.slStatus.text;
                            course.checked = false;
                        }
                        $scope.$apply();
                        $('#changeCoursesStatus').modal('hide');
                        $scope.slStatus = $scope.status[0];
                    }
                );
            }
        };
    })

    .controller('creator.admin.lessons.list.ctrl', function($scope, $state, lessonsSrv, lessons, showActionBar) {
        $scope.lessons = lessons;
        $scope.show = {};
        $scope.show.actionBar = showActionBar;
        $scope.status = [
            {'text': 'Prepare for creating', 'value': 1},
            {'text': 'Waiting for creating', 'value': 2},
            {'text': 'Creation received', 'value': 3},
            {'text': 'Waiting for review', 'value': 4},
            {'text': 'In review', 'value': 5},
            {'text': 'Pending contract', 'value': 6},
            {'text': 'Pending creator release', 'value': 7},
            {'text': 'Pending store release', 'value': 8},
            {'text': 'Processing for store', 'value': 9},
            {'text': 'Ready for sale', 'value': 10},
            {'text': 'Rejected', 'value': 11},
            {'text': 'Removed from sale', 'value': 12}
        ];
        $scope.slStatus = $scope.status[0];

        $scope.getStatusStyle = function (status) {
            var style = {};
            style['font-weight'] = 'bold';
            switch (status) {
                case 10:
                    style.color = "green";
                    break;
                default:
                    style.color = "orange";
                    break;
            }
            return style;
        };

        $scope.changeSelectedLessonsStatus = function() {
            var patches = [];
            var updatePath = "/";
            var index = 0;
            var changedLessons = [];
            for (var i in lessons) {
                var lesson = lessons[i];
                if (lesson.checked && lesson.status != $scope.slStatus.value) {
                    updatePath += lesson.id + ",";
                    var patch = {op: 'replace', path: '/lessons/'+ index++ +"/status", value: $scope.slStatus.value};
                    patches.push(patch);
                    changedLessons.push(lesson);
                }
            }
            if (patches.length > 0) {
                updatePath = updatePath.slice(0, -1);
                lessonsSrv.updatePatch(patches, updatePath,
                    function(progress) {
                        console.log("Saving changed...");
                    },
                    function(success) {
                        for (var i in changedLessons) {
                            var lesson = changedLessons[i];
                            lesson.status = $scope.slStatus.value;
                            lesson.status_name = $scope.slStatus.text;
                            lesson.checked = false;
                        }
                        $scope.$apply();
                        $('#changeLessonsStatus').modal('hide');
                        $scope.slStatus = $scope.status[0];
                    }
                );
            }
        };
    });