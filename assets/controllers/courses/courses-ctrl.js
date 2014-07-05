/**
 * Created by Hien on 5/31/2014.
 */

angular.module('creator.courses.controller', [
    'creator.api.service',
    'creator.courses.service',
    'creator.pictures.service'
])
    .service('courseUtils', function(picturesSrv) {
        var self = this;

        var initTrackingData = function(scope) {
            scope.previous = {};
            scope.previous.course = {};
        };

        var initValidateData = function(scope) {
            scope.invalid = {};
            scope.invalid.course = {};
            scope.validated = {};
            scope.validated.course = {};
        };

        var initLoadingData = function(scope) {
            scope.loading = {};
            scope.loading.course = {};
        };

        var loadStaticData = function(scope) {
            scope.contentTypes = [
                {name:"Course", value: 'course'},
                {name:'Lesson', value:'lesson'}
            ];
        };

        var loadCourseContentType = function (scope) {
            if (!scope.course) return;

            if (scope.course.content_type) {
                switch (scope.course.content_type) {
                    case 'course':
                        scope.course.slContentType = scope.contentTypes[0];
                        break;
                    case 'lesson':
                        scope.course.slContentType = scope.contentTypes[1];
                }
            }
            else {
                scope.course.slContentType = scope.contentTypes[0];
            }
        };

        var loadChangeTracking = function(scope) {
            scope.previous.course['name'] = scope.course.name;
            scope.previous.course['picture_url'] = scope.course.picture_url;
            scope.previous.course['description'] = scope.course.description;
        };

        var hasDataChanged = function(scope) {
            if (scope.previous.course.name !== scope.course.name ||
                scope.previous.course.picture_url !== scope.course.picture_url ||
                scope.previous.course.description !== scope.course.description) {
                return true;
            }
            return false;
        };

        this.initializeScope = function(scope) {
            initTrackingData(scope);
            initValidateData(scope);
            initLoadingData(scope);

            loadStaticData(scope);
            loadCourseContentType(scope);
            loadChangeTracking(scope);

            scope.changeName = function() {
                scope.validated.course.name = false;
                self.refreshValidateData(scope);
            };

            scope.validateName = function() {
                self.validateCourseName(scope);
                self.refreshValidateData(scope);
            };

            scope.changePictureUrl = function() {
                scope.validated.course.picture_url = false;
                self.refreshValidateData(scope);
            };

            scope.validatePictureUrl = function() {
                self.validateCoursePictureUrl(scope);
                self.refreshValidateData(scope);
            };

            scope.changeContentType = function() {
                self.refreshValidateData(scope);
            };

            scope.changeDescription = function() {
                self.refreshValidateData(scope);
            }

        };

        this.validateCourseName = function(scope) {
            if (scope.validated.course.name) return;

            if (!scope.course.name) {
                scope.invalid.course.name = true;
            }
            else {
                scope.invalid.course.name = false;
                scope.validated.course.name = true;
            }
        };

        this.validateCoursePictureUrl = function(scope) {
            if (scope.validated.course.picture_url) return;

            if (scope.course.picture_url) {
                scope.loading.course.picture_url = true;
                picturesSrv.checkPictureUrl(scope.course.picture_url, function(valid) {
                    scope.invalid.course.picture_url = !valid;
                    scope.loading.course.picture_url = false;
                    scope.validated.course.picture_url = valid;
                    self.refreshValidateData(scope);
                    scope.$apply();
                });
            }
            else {
                scope.invalid.course.picture_url = true;
            }

        };

        this.refreshValidateData = function(scope) {
            if (scope.validated.course.name &&
                scope.validated.course.picture_url) {

                scope.validated.course.all = true;
                return true;
            }
            else {
                scope.validated.course.all = false;
                return false;
            }
        };

        this.isDataValid = function(scope) {
            self.validateCourseName(scope);
            self.validateCoursePictureUrl(scope);
            self.refreshValidateData(scope);
            return scope.validated.course.all;
        };

    })

    .controller('creator.courses.detail.ctrl', function(Seo, $scope, $state, course) {
        Seo.title = course.name;
        $scope.course = course;
    })

    .controller('creator.courses.list.ctrl', function($scope, $state, courses) {
        console.log("creator.courses.list.ctrl loading...");
        $scope.courses = [];
        for (var i in courses) {
            if (!courses[i].parent) {
                $scope.courses[$scope.courses.length] = courses[i];
            }
        }
        // $scope.courses = courses;
    })

    .controller('creator.courses.edit.ctrl', function($scope, $state, courseUtils, coursesSrv, course) {
        $scope.course = course;
        courseUtils.initializeScope($scope);
        courseUtils.isDataValid($scope);
        $scope.disabled.course.contentType = true;
        $scope.save = function() {
            if (!courseUtils.isDataValid($scope)) return;

            var updateItems = [];
            var hasChanged = false;
            if ($scope.previous.course.name !== $scope.course.name) {
                updateItems.push({op:'replace', path:'/courses/0/name', value:$scope.course.name});
                hasChanged = true;
            }
            if ($scope.previous.course.picture_url !== $scope.course.picture_url) {
                updateItems.push({op:'replace', path:'/courses/0/picture_url', value:$scope.course.picture_url});
                hasChanged = true;
            }
            if ($scope.previous.course.description !== $scope.course.description) {
                updateItems.push({op:'replace', path:'/courses/0/description', value:$scope.course.description});
                hasChanged = true;
            }
            console.log("Update items: " + JSON.stringify(updateItems));
            if (hasChanged) {
                coursesSrv.update(updateItems, "/" + $scope.course.id,
                    function(progress) {
                        $('#btnSave').button('loading');
                    },
                    function(resp) {
                        $('#btnSave').button('complete');
                        $state.go('courses-detail-contents', {id: $scope.course.id},
                            {location: true, inherit: true, relative: $state.$current, notify: true }
                        );
                    }
                )
            }
        }
    })


    .controller('creator.courses.new.ctrl', function($scope, $state, courseUtils, coursesSrv, course){
        $scope.course = course;
        courseUtils.initializeScope($scope);

        $scope.save = function() {
            if (!courseUtils.isDataValid($scope)) return;

            var course = {};
            course.name = $scope.course.name;
            course.content_type = $scope.course.slContentType.value;
            course.description = $scope.course.description;
            course.picture_url = $scope.course.picture_url;
            if ($scope.parent) {
                course.parent = {id: $scope.parent.id};
            }
            console.log(JSON.stringify(course));
            coursesSrv.create(course,
                function (progress) {
                    console.log("Saving...")
                    $('#btnSave').button('loading');
                },
                function (response) {
                    console.log(JSON.stringify(response));
                    $('#btnSave').button('complete');
                    $state.go('courses-detail-contents', {id: response.course.id},
                        {location: true, inherit: true, relative: $state.$current, notify: true }
                    );
                }
            );
        };
    });