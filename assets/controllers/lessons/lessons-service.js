/**
 * Created by Hien on 6/2/2014.
 */

angular.module('creator.lessons.service', [
    'creator.api.service',
    'creator.users.service'
])
    .config(function($httpProvider) {
        //Enable cross domain calls
        $httpProvider.defaults.useXDomain = true;

        //Remove the header used to identify ajax call  that would prevent CORS from working
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    })

    .factory('lessonsSrv', ['$http','api','utils', 'userSrv', function ($http, api, utils, userSrv){
        var path = api.serverPath();
        var factory = {};

        factory.findById = function () {
            var id = arguments[0];
            var opts = arguments[1] || {};
            var lesson = $http({
                method: 'GET',
                url: path + "/lessons/" + id,
                headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'}

            }).then(function(resp) {
                console.log(JSON.stringify(resp.data.lesson));
                return resp.data.lesson;
            });
            return lesson.then(function(){
                return lesson;
            });
        };

        factory.save = function(lesson) {
            var onProgressHandler = arguments[1];
            var onSuccessHandler = arguments[2];
            var xhr = new XMLHttpRequest();
            var url = path + "/lessons";
            var params = "lesson=" + JSON.stringify(lesson);
            xhr.open('POST', url, true);
            xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            xhr.setRequestHeader('Access-Token', userSrv.getToken().value);
            xhr.onprogress = function(progress) {
                console.log(progress);
                if (onProgressHandler)
                    onProgressHandler(progress);
            };
            xhr.onload = function() {
                if (this.status === 201) {
                    var resp = JSON.parse(this.response);
                    console.log(resp);
                    if (onSuccessHandler)
                        onSuccessHandler(resp);
                }
            };
            xhr.send(params);
        };

        factory.update = function(lesson) {
            var onProgressHandler = arguments[1];
            var onSuccessHandler = arguments[2];
            var xhr = new XMLHttpRequest();
            var url = path + "/lessons/" + lesson.id;
            var params = "lesson=" + JSON.stringify(lesson);
            xhr.open('POST', url, true);
            xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            xhr.setRequestHeader('Access-Token', userSrv.getToken().value);
            xhr.onprogress = function(progress) {
                if (onProgressHandler)
                    onProgressHandler(progress);
            };
            xhr.onload = function() {
                if (this.status === 200) {
                    var resp = JSON.parse(this.response);
                    if (onSuccessHandler)
                        onSuccessHandler(resp);
                }
            };
            xhr.send(params);
        };

        return factory;
    }]);
