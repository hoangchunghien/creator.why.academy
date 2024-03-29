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
            scope.disabled = {};
            scope.disabled.course = {};
            scope.show = {};
            scope.show.course = {};

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

    .controller('creator.courses.list.ctrl', function($scope, $state, coursesSrv, courses, showActionBar) {
        if (!$scope.action) $scope.action = {};
        if (!$scope.action.show) $scope.action.show = {};

        if (showActionBar) {
            if (courses && courses.length > 0) $scope.action.show.bar = true;
        }
        console.log("creator.courses.list.ctrl loading...");
        $scope.courses = [];
        for (var i in courses) {
            if (!courses[i].parent) {
                $scope.courses[$scope.courses.length] = courses[i];
            }
        }

        // Initialize for order function
        if (!$scope.action.order) $scope.action.order = {};
        $scope.action.order.switchOnOff = function() {
            $scope.action.order.enabled = !$scope.action.order.enabled;
        };

        $scope.activateOrder = function(course) {
            if (!course.order) {
                course.order = {};
                course.order.activated = true;
                course.order.numbers = [];
                var num = 0;
                for (var i in $scope.courses) {
                    course.order.numbers.push(num++);
                }
            }
        };
        $scope.changeOrderNumber = function(course) {
            var updatePath = "/" + course.id;
            var patches = [];
            patches.push({op: 'replace', 'path': '/courses/0/order_number', value: course.order_number});
            coursesSrv.update(patches, updatePath,
                function(progress) {
                    console.log("Saving changed...");
                },
                function(success) {
                    alert("Change order success, reload page to see change");
                }
            )
        };
    })

    .controller('creator.courses.edit.ctrl', function($scope, $state, courseUtils, coursesSrv, course, descendants, root) {
        $scope.title = "EDIT COURSE";

        $scope.course = course;
        courseUtils.initializeScope($scope);
        courseUtils.isDataValid($scope);
        $scope.disabled.course.contentType = true;
        $scope.show.course.slParent = false;
        $scope.show.course.enableSlParent = true;
        /**
         * Initialize select for change subcourse parent
        **/
        var descendantsArr = coursesSrv.descendantsToArray(descendants);
        if (root) {
            descendantsArr.push({id: root.id, name: root.name, content_type: root.content_type});
            console.log(root);
        }
        $scope.courseParents = [];
        for (var i in descendantsArr) {
            var descendant = descendantsArr[i];
            if (descendant.content_type == "course" && descendant.id !== course.id) {
                $scope.courseParents.push(descendantsArr[i]);
                if ($scope.course.parent.id == descendant.id) {
                    $scope.course.slParent = descendantsArr[i];
                    $scope.previous.course.slParent = descendantsArr[i];
                }
            }
        }
        $scope.showChangeParent = function() {
            $scope.show.course.slParent = true;
            $scope.show.course.enableSlParent = false;
        }

        console.log(descendantsArr);
        $scope.save = function() {
            if (!courseUtils.isDataValid($scope)) return;

            var updateItems = [];
            var hasChanged = false;
            if ($scope.previous.course.slParent !== $scope.course.slParent) {
                updateItems.push({op:'replace', path:'/courses/0/links/parent', value: $scope.course.slParent.id});
                hasChanged = true;
            }
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
        $scope.title = "NEW COURSE";
        $scope.course = course;
        courseUtils.initializeScope($scope);

        $scope.save = function() {
            if (!courseUtils.isDataValid($scope)) return;

            var course = {};
            course.name = $scope.course.name;
            course.content_type = $scope.course.slContentType.value;
            course.description = $scope.course.description;
            course.picture_url = $scope.course.picture_url;
            if ($scope.course.parent) {
                course.parent = {id: $scope.course.parent.id};
            }
            console.log(JSON.stringify(course));
            coursesSrv.create(course,
                function (progress) {
                    console.log("Saving...");
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