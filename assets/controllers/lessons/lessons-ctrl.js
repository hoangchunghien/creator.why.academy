/**
 * Created by Hien on 5/30/2014.
 */

angular.module('creator.lessons.controller', [
    'creator.utils.service',
    'creator.phonetic.service',
    'creator.users.service',
    'creator.audio.service',
    'creator.lessons.service',
    'creator.pictures.service'
])
    .service('lessonUtils', function ($http, audioSrv, picturesSrv, phoneticSrv) {

        var self = this;

        var loadStaticData = function (scope) {
            scope.languages = [
                {'name': 'English', 'value': 'en'}
            ];
            scope.types = [
                {'name': 'Word', 'value': 'word'}
            ];
        };

        var loadLessonType = function (scope) {
            if (!scope.lesson) return;

            if (scope.lesson.type) {
                switch (scope.lesson.type) {
                    case 'word':
                        scope.lesson.slType = scope.types[0];
                        break;
                }
            }
            else {
                scope.lesson.slType = scope.types[0];
            }
        };

        var loadLessonLanguage = function (scope) {
            if (!scope.lesson) return;

            if (scope.lesson.language) {
                switch (scope.lesson.language) {
                    case 'en':
                        scope.lesson.slLanguage = scope.languages[0];
                        break;
                }
            }
            else {
                scope.lesson.slLanguage = scope.languages[0];
            }
        };

        var loadLessonDifficulty = function (scope) {
            if (!scope.lesson) return;

            if (!scope.lesson.difficulty_level) {
                scope.lesson.difficulty_level = 0;
            }
            self.validateDifficultyLevel(scope);
        };

        var loadLessonContent = function (scope) {
            scope.lesson.content = angular.fromJson(scope.lesson.content);

            if (!scope.lesson.content)
                scope.lesson.content = {};
            if (!scope.lesson.content['examples'] || scope.lesson.content['examples'].length === 0) {
                scope.lesson.content['examples'] = [
                    {'text': ''}
                ];
            }
            if (!scope.lesson.content['phonetics'] || scope.lesson.content['phonetics'].length === 0) {
                scope.lesson.content['phonetics'] = [
                    {'text': ''}
                ];
            }
        };

        var initValidateData = function (scope) {
            scope.invalid = {};
            scope.invalid.lesson = {};
            scope.valid = {};
            scope.valid.lesson = {};
        };

        var initLoadingData = function (scope) {
            scope.loading = {};
            scope.loading.lesson = {};
        };

        var initValidatedFields = function (scope) {
            scope.validated = {};
            scope.validated.lesson = {};
        };

        var refreshSoundUrl = function (scope) {
            if (!scope.lesson.id) {
                if (scope.lesson.name) {
                    scope.lesson.audio_url = "https://ssl.gstatic.com/dictionary/static/sounds/de/0/" + scope.lesson.name + ".mp3";
                }
                else {
                    scope.lesson.audio_url = "";
                }
                scope.validated.lesson.audio_url = false;
                self.validateLessonAudioUrl(scope);
                scope.$apply();
            }
        };

        var removeExistInArray = function (arr) {
            var result = [];
            for (var k in arr) {

                var found = false;
                for (var l in result) {
                    if (result[l] === arr[k]) {
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    result[result.length] = arr[k];
                }
            }
            return result;
        };

        var retrievePhonetic = function (scope) {
            phoneticSrv.findAll(scope.lesson.name, function (phonetics) {
                if (phonetics && phonetics.length > 0) {
                    phonetics = removeExistInArray(phonetics);
                    scope.lesson.content.phonetics = [];
                    for (var key in phonetics) {
                        var i = scope.lesson.content.phonetics.length;
                        scope.lesson.content.phonetics[i] = {};
                        scope.lesson.content.phonetics[i].text = phonetics[key];
                    }
                    scope.$apply();
                }
            });
        };

        var generateLessonContent = function (lessonContent) {
            var content = {};
            content['text'] = lessonContent.text;
            for (var i = lessonContent['examples'].length - 1; i >= 0; i--) {
                if (lessonContent['examples'][i].text === "") {
                    lessonContent['examples'].splice(i, 1);
                }
            }
            content['examples'] = lessonContent.examples;

            for (var i = lessonContent['phonetics'].length - 1; i >= 0; i--) {
                if (lessonContent['phonetics'][i].text === "") {
                    lessonContent['phonetics'].splice(i, 1);
                }
            }
            content['phonetics'] = lessonContent.phonetics;
            return angular.toJson(content);
        };

        var loadLessonExamples = function (scope, example) {
            var length = scope.lesson.content['examples'].length;
            if (example.text) {
                var hasEmpty = false;
                for (var i = 0; i < length; i++) {
                    if (scope.lesson.content['examples'][i].text === "") {
                        hasEmpty = true;
                        break;
                    }
                }
                if (!hasEmpty) {
                    scope.lesson.content['examples'][length] = {'text': ''};
                }
            }
            else {
                for (var i = length - 1; i >= 0; i--) {
                    if (scope.lesson.content['examples'][i] !== example && scope.lesson.content['examples'][i].text === "") {
                        scope.lesson.content['examples'].splice(i, 1);
                    }
                }
            }
        };

        var removeLessonExample = function (scope, example) {
            if (example.text) {
                var i = scope.lesson.content['examples'].indexOf(example);
                scope.lesson.content['examples'].splice(i, 1);
            }
        };

        var loadLessonPhonetics = function (scope, phonetic) {

            var length = scope.lesson.content['phonetics'].length;
            if (phonetic.text) {
                var hasEmpty = false;
                for (var i = 0; i < length; i++) {
                    if (scope.lesson.content['phonetics'][i].text === "") {
                        hasEmpty = true;
                        break;
                    }
                }
                if (!hasEmpty) {
                    scope.lesson.content['phonetics'][length] = {'text': ''};
                }
            }
            else {
                for (var i = length - 1; i >= 0; i--) {
                    if (scope.lesson.content['phonetics'][i] !== phonetic && scope.lesson.content['phonetics'][i].text === "") {
                        scope.lesson.content['phonetics'].splice(i, 1);
                    }
                }
            }
        };

        var removeLessonPhonetic = function (scope, phonetic) {
            if (phonetic.text) {
                var i = scope.lesson.content['phonetics'].indexOf(phonetic);
                scope.lesson.content['phonetics'].splice(i, 1);
            }
        };

        this.validateLessonName = function (scope) {
            if (scope.validated.lesson.name) return;

            if (!scope.lesson.name) {
                scope.invalid.lesson.name = true;
            }
            else {
                scope.invalid.lesson.name = false;
                scope.validated.lesson.name = true;
            }
        };

        this.validateDifficultyLevel = function (scope) {
            if (scope.validated.lesson.difficulty_level) return;

            if (typeof scope.lesson.difficulty_level !== 'number') {
                scope.invalid.lesson.difficulty_level = true;
            }
            else {
                scope.invalid.lesson.difficulty_level = false;
                scope.validated.lesson.difficulty_level = true;
            }
        };

        this.validateLessonAudioUrl = function (scope) {
            if (scope.validated.lesson.audio_url) return;

            if (scope.lesson.audio_url) {
                scope.loading.lesson.audio_url = true;
                audioSrv.checkSoundUrl(scope.lesson.audio_url, function (valid) {
                    scope.invalid.lesson.audio_url = !valid;
                    scope.loading.lesson.audio_url = false;
                    scope.validated.lesson.audio_url = valid;
                    isValidated(scope);
                    scope.$apply();
                });
            }
            else {
                scope.invalid.lesson.audio_url = true;
            }
        };

        this.validateLessonPictureUrl = function (scope) {
            if (scope.validated.lesson.picture_url) return;

            if (scope.lesson.picture_url) {
                scope.loading.lesson.picture_url = true;
                picturesSrv.checkPictureUrl(scope.lesson.picture_url, function (valid) {
                    scope.invalid.lesson.picture_url = !valid;
                    scope.loading.lesson.picture_url = false;
                    scope.validated.lesson.picture_url = valid;
                    isValidated(scope);
                    scope.$apply();
                });
            }
            else {
                scope.invalid.lesson.picture_url = true;
            }

        };

        this.validateLessonScope = function (scope) {
            self.validateLessonName(scope);
            self.validateDifficultyLevel(scope);
            self.validateLessonAudioUrl(scope);
            self.validateLessonPictureUrl(scope);
        };

        var isValidated = function (scope) {
            if (scope.validated.lesson.name &&
                scope.validated.lesson.difficulty_level &&
                scope.validated.lesson.audio_url &&
                scope.validated.lesson.picture_url) {

                scope.validated.lesson.all = true;
                return true;
            }
            else {
                scope.validated.lesson.all = false;
                return false;
            }
        };

        this.isLessonScopeValid = function (scope) {
            self.validateLessonScope(scope);
            return isValidated(scope);
        };

        this.initializeScope = function (scope) {
            initValidateData(scope);
            initLoadingData(scope);
            initValidatedFields(scope);

            loadStaticData(scope);
            loadLessonType(scope);
            loadLessonLanguage(scope);
            loadLessonDifficulty(scope);
            loadLessonContent(scope);

            scope.reloadExamples = function (example) {
                loadLessonExamples(scope, example);
            };

            scope.removeExample = function (example) {
                removeLessonExample(scope, example);
            };

            scope.reloadPhonetics = function (phonetic) {
                loadLessonPhonetics(scope, phonetic);
            };

            scope.removePhonetic = function (phonetic) {
                removeLessonPhonetic(scope, phonetic);
            };

            scope.playAudio = function (audioUrl) {
                audioSrv.playAudio(audioUrl);
            };

            scope.changeName = function () {
                scope.validated.lesson.name = false;
                isValidated(scope);
            };

            scope.validateName = function () {
                self.validateLessonName(scope);
                isValidated(scope);
            };

            scope.changeDifficultyLevel = function () {
                scope.validated.lesson.difficulty_level = false;
                isValidated(scope);
            };

            scope.validateDifficultyLevel = function () {
                self.validateDifficultyLevel(scope);
                isValidated(scope);
            };

            scope.changeAudioUrl = function () {
                scope.validated.lesson.audio_url = false;
                isValidated(scope);
            };

            scope.validateAudioUrl = function () {
                self.validateLessonAudioUrl(scope);
                isValidated(scope);
            };

            scope.changePictureUrl = function () {
                scope.validated.lesson.picture_url = false;
                isValidated(scope);
            };

            scope.validatePictureUrl = function () {
                self.validateLessonPictureUrl(scope);
                isValidated(scope);
            };

            scope.retrievePhonetic = function () {
                retrievePhonetic(scope);
            };


            var typingTimer;
            var doneTypingInterval = 900;
            scope.handleTypingName = function () {
                clearTimeout(typingTimer);
                typingTimer = setTimeout(function () {
                    refreshSoundUrl(scope);
                    retrievePhonetic(scope);
                }, doneTypingInterval);
            };

        };

        this.generateLessonFromScope = function (scope) {
            var lesson = {};
            lesson.id = scope.lesson.id;
            lesson.name = scope.lesson.name;
            lesson.picture_url = scope.lesson.picture_url;
            lesson.type = scope.lesson.slType.value;
            lesson.language = scope.lesson.slLanguage.value;
            lesson.audio_url = scope.lesson.audio_url;
            lesson.difficulty_level = scope.lesson.difficulty_level;
            lesson.course_id = scope.lesson.course_id;
            lesson.content = generateLessonContent(scope.lesson.content);
            return lesson;
        }
    })

    .controller('lessons.list.ctrl', function ($scope, audioSrv, lessonsSrv, utils, course, lessons, descendants) {
        console.log("lesson.list.ctrl loading...");

        //
        // Initialize for lessons order function -----------------------------------------------------------------------
        //
        var initializeForOrder = function () {
            if (!$scope.action) $scope.action = {};
            if (!$scope.action.order) $scope.action.order = {};
            $scope.action.order.enabled = false;
            $scope.action.order.numbers = [];

            $scope.loadOrderNumbers = function (lesson) {
                if (!lesson.order) lesson.order = {};
                lesson.order.activated = true;
                if (!lesson.order.numbers) {
                    lesson.order.loading = true;
                    setTimeout(function () {
                        lesson.order.numbers = [];
                        var num = 0;
                        for (var i in $scope.lessons) {
                            lesson.order.numbers.push(num++);
                        }
                        lesson.order.loading = false;
                        $scope.$apply();
                    }, 200);
                }
            };

            $scope.action.order.changeOrder = function (lesson) {
                if (!lesson.action) lesson.action = {};
                if (!lesson.action.updating) lesson.action.updating = {};
                if (!lesson.action.reload) lesson.action.reload = {};

                var updatePath = "/" + lesson.id;
                var patches = [];
                patches.push({op: 'replace', 'path': '/lessons/0/order_number', value: lesson.order_number});
                lessonsSrv.updatePatch(patches, updatePath,
                    function (progress) {
                        lesson.action.updating.order_number = true;
                        $scope.$apply();
                    },
                    function (success) {
                        lesson.action.updating.order_number = false;
                        lesson.action.reload.order_number = true;
                        $scope.$apply();
                        alert("Change order success, reload page to see change");
                    }
                );
            };

            $scope.action.order.switchOnOff = function () {
                $scope.action.order.enabled = ($scope.action.order.enabled) ? false : true;
            };
        };

        var initializeForMovingLessons = function () {
            //
            // Initialize for moving lessons function ----------------------------------------------------------------------
            //
            $scope.tracking = {};
            $scope.checkedLessons = {};
            $scope.moving = {};
            $scope.moving.leafCourses = [];
            for (var i in descendants) {
                if (descendants[i].content_type == "lesson") {
                    $scope.moving.leafCourses.push(descendants[i]);
                    if (descendants[i].id == course.id) {
                        $scope.moving.slCourse = descendants[i];
                        $scope.tracking.slCourse = descendants[i];
                    }
                }
            }

            $scope.moveLessons = function () {
                if ($scope.moving.slCourse !== $scope.tracking.slCourse) {
                    console.log("moving lessons...");
                    var updatePath = "/";
                    var patches = [];
                    var lessonsToMove = [];
                    var index = 0;
                    for (var i in $scope.lessons) {
                        if ($scope.lessons[i].checked) {
                            updatePath += $scope.lessons[i].id + ",";
                            patches.push({op: 'replace', path: '/lessons/' + index++ + "/links/course", value: $scope.moving.slCourse.id});
                            lessonsToMove.push($scope.lessons[i]);
                        }
                    }
                    if (patches.length > 0) {
                        updatePath = updatePath.slice(0, -1);
                        lessonsSrv.updatePatch(patches, updatePath,
                            function (onprogress) {
                                $('#movingBtn').button('loading');
                            },
                            function (onsuccess) {
                                for (var i in lessonsToMove) {
                                    $scope.lessons.splice($scope.lessons.indexOf(lessonsToMove[i]), 1);
                                }
                                $('#movingBtn').button('reset');
                                $('#lessonMoving').modal('hide');
                                $scope.moving.slCourse = $scope.tracking.slCourse;
                                $scope.$apply();
                            }
                        );
                        console.log(updatePath);
                        console.log(patches);
                    }
                }
            }
        };

        var initialize = function () {
            initializeForOrder();
            initializeForMovingLessons();
            $scope.lessons = lessons;
            initPhonetics();
        };

        var initPhonetics = function () {
            console.log('Initializing phonetics...');
            for (var i = 0; i < lessons.length; i++) {
                initPhonetic(lessons[i]);
            }
        };

        var initPhonetic = function (lesson) {
            var content = lesson.content;
            if (content) {
                content = angular.fromJson(content);
                lesson.phonetics = content.phonetics;
            }
        };

        $scope.playAudio = function (audioUrl) {
            audioSrv.playAudio(audioUrl);
        };

        $scope.deleteLesson = function (id) {
            var accept = confirm("Are you sure to delete lesson with id=" + id + "?");
            if (accept) {
                lessonsSrv.delete(id,
                    function (progress) {

                    },
                    function (resp) {
                        utils.remove($scope.lessons, id);
                        $scope.$apply();
                        alert("Success");
                    }
                );
            }
        };


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

        initialize();
    })

    .controller('lessons.detail.ctrl', function ($scope, lesson) {
        $scope.lesson = lesson;
    })

    .controller('lessons.detail.edit.ctrl', function (Seo, $scope, $state, lessonsSrv, lessonUtils, lesson) {
        Seo.title = "Edit " + lesson.name;
        $scope.action = "EDIT LESSON";
        $scope.lesson = lesson;
        lessonUtils.initializeScope($scope);
        lessonUtils.validateLessonScope($scope);

        $scope.saveChange = function () {
            if (lessonUtils.isLessonScopeValid($scope))
                update();
        };

        var update = function () {
            var lesson = lessonUtils.generateLessonFromScope($scope);
            lessonsSrv.update(lesson,
                function (progress) {
                    console.log("Saving... " + JSON.stringify(lesson));
                    $("#btnEditorSaveChange").button('loading');
                },
                function (resp) {
                    console.log("Success: " + JSON.stringify(resp));
                    $("#btnEditorSaveChange").button('complete');
                    $state.go('courses-detail-contents', {id: lesson.course_id},
                        {location: true, inherit: true, relative: $state.$current, notify: true }
                    );
                }
            );
        };

    })

    .controller('lessons.new.ctrl', function (Seo, $scope, $state, lessonsSrv, lessonUtils, lesson, lessons) {
        Seo.title = "New lesson";
        $scope.action = "NEW LESSON";
        $scope.lesson = lesson;
        lessonUtils.initializeScope($scope);

        $scope.saveChange = function () {
            if (lessonUtils.isLessonScopeValid($scope))
                save();
        };

        var save = function () {
            var lesson = lessonUtils.generateLessonFromScope($scope);
            lessonsSrv.save(lesson,
                function (progress) {
                    console.log("Saving..." + JSON.stringify(lesson));
                    $("#btnEditorSaveChange").button('loading');
                },
                function (resp) {
                    console.log("Success: " + JSON.stringify(resp));
                    $("#btnEditorSaveChange").button('complete');
                    lessons.push(resp.lesson);
                    $state.go('courses-detail-contents', {id: lesson.course_id},
                        {location: true, inherit: true, relative: $state.$current, notify: true }
                    );
                }
            );
        }
    });