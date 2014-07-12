/**
 * Created by Hien on 5/31/2014.
 */

angular.module('creator.courses.service', [
    'creator.courses.service',
    'creator.api.service',
    'creator.users.service'
])
    .config(function($httpProvider) {
        //Enable cross domain calls
        $httpProvider.defaults.useXDomain = true;

        //Remove the header used to identify ajax call  that would prevent CORS from working
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    })
    .factory('coursesSrv', ['$http','api','utils','userSrv', function ($http, api, utils, userSrv){
        var path = api.serverPath();
        var factory = {};

        factory.findAll = function() {
            var opts = arguments[0];

            var params = {};
            if (opts) {
                if (opts.query) {
                    if (opts.query.status) {
                        params['q[status]'] = opts.query.status;
                    }

                    if (opts.query.user && opts.query.user.id) {
                        params['q[user.id]'] = opts.query.user.id;
                    }
                }
                if (opts.fields) {
                    if (opts.fields.user) {
                        params['fields[user]'] = opts.fields.user;
                    }
                }
                if (opts.include) {
                    params['include'] = opts.include;
                }
            }
            var courses = $http({
                method: 'GET',
                url: path + "/v2/courses",
                params: params,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
                    'Access-Token': userSrv.getToken().value
                }

            }).then(function(resp) {
                console.log(JSON.stringify(resp.data.courses));
                return resp.data.courses;
            });
            return courses.then(function(){
                return courses;
            })
        };

        factory.findById = function () {
            var id = arguments[0];
            var opts = arguments[1] || {};
            var include = "parent";
            var params = {'include': "parent", 'q[status]': '0,1,2,3,4,5,6,7,8,9,10,11,12,13'};
            if (opts) {
                if (opts.include_contents) {
                    include += ",courses,lessons";
                    params['include'] = include;
                    params['fields[lessons]'] = "id,name,picture_url,difficulty_level,type,language,audio_url,content,status,created_at,order_number";
                    params['fields[courses]'] = "id,name,content_type,description,picture_url,status,order_number";
                    params['q[lessons.status]'] = "0,1,2,3,4,5,6,7,8,9,10,11,12,13";
                    params['q[courses.status]'] = "0,1,2,3,4,5,6,7,8,9,10,11,12,13";
                }
                if (opts.fields) {
                    if (opts.fields.user) {
                        params['fields[user]'] = opts.fields.user;
                    }
                }
                if (opts.sort) {
                    if (opts.sort.lessons) {
                        params['sort[lessons]'] = opts.sort.lessons;
                    }
                    if (opts.sort.courses) {
                        params['sort[courses]'] = opts.sort.courses;
                    }
                }
            }
            var courses = $http({
                method: 'GET',
                url: path + "/v2/courses/" + id,
                params: params,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
                    'Access-Token': userSrv.getToken().value
                }

            }).then(function(resp) {
                console.log(JSON.stringify(resp.data.courses));
                return resp.data.courses[0];
            });
            return courses.then(function(){
                return courses;
            })

        };

        factory.create = function(course) {
            var onProgressHandler = arguments[1];
            var onSuccessHandler = arguments[2];

            console.log("saving data: " + JSON.stringify(course));
            var xhr = new XMLHttpRequest();
            var url = path + "/v2/courses";
            xhr.open('POST', url, true);
            xhr.setRequestHeader('Content-type', 'application/vnd.api+json; charset=utf-8');
            xhr.setRequestHeader('Access-Token', userSrv.getToken().value);

            xhr.onprogress = function(e) {
                if (onProgressHandler) onProgressHandler(e);
            };
            xhr.onload = function() {
                if (this.status === 201) {
                    var resp = JSON.parse(this.response);
                    if (onSuccessHandler) onSuccessHandler(resp);
                }
            };
            xhr.send(JSON.stringify(course));
        };

        factory.update = function(items, updatePath) {
            var onProgressHandler = arguments[2];
            var onSuccessHandler = arguments[3];

            console.log("Updating data: " + JSON.stringify(items));
            var xhr = new XMLHttpRequest();
            var url = path + "/v2/courses" + updatePath;
            xhr.open('PATCH', url, true);
            xhr.setRequestHeader('Content-type', 'application/vnd.api+json; charset=utf-8');
            xhr.setRequestHeader('Access-Token', userSrv.getToken().value);

            xhr.onprogress = function(e) {
                if (onProgressHandler) onProgressHandler(e);
            };
            xhr.onload = function() {
                if (this.status === 204 ) {
                    if (onSuccessHandler) onSuccessHandler({message: "Updated, refresh to see changed"});
                }
            };
            xhr.send(JSON.stringify(items));
        };

        factory.findAncestors = function(id) {
            var ancestors = $http({
                method: 'GET',
                url: path + "/v2/courses/" + id + "/ancestors",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
                    'Access-Token': userSrv.getToken().value
                }
            }).then(function(resp) {
                console.log(JSON.stringify(resp.data.ancestors));
                return resp.data.ancestors;
            }, function(data) {
                console.log("Error: " + JSON.stringify(data));
                return {};
            });
            return ancestors.then(function() {
                return ancestors;
            });
        };

        factory.ancestorsToArray = function(ancestors) {
            var i = 0;
            var temp = [];
            if (ancestors.id) {
                temp[i++] = {id: ancestors.id, name: ancestors.name, content_type: ancestors.content_type};
                var parent = ancestors.parent;
                while (parent) {
                    temp[i++] = {id: parent.id, name: parent.name, content_type: parent.content_type};
                    parent = parent.parent;
                }
            }
            var results = [];
            for (var i = temp.length - 1; i >= 0; i--) {
                results.push(temp[i]);
            }
            return results;
        };

        factory.findDescendants = function(id) {
            var descendants = $http({
                method: 'GET',
                url: path + "/v2/courses/" + id + "/descendants",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
                    'Access-Token': userSrv.getToken().value
                }
            }).then(function(resp) {
                console.log(JSON.stringify(resp.data.descendants));
                return resp.data.descendants;
            }, function(error) {
                console.log("Error: " + JSON.stringify(error));
                return [];
            });
            return descendants.then(function() {
                return descendants;
            });
        };

        var treeCourseToArray = function(course) {
            var arr = [];
            arr.push({id: course.id, name: course.name, content_type: course.content_type});
            var courses = course.courses;
            if (courses) {
                for (var i in courses) {
                    arr = arr.concat(treeCourseToArray(courses[i]));
                }
            }
            return arr;
        };

        factory.descendantsToArray = function(descendants) {
            var results = [];
            for (var i in descendants) {
                console.log(descendants);
                results = results.concat(treeCourseToArray(descendants[i]));
            }
            return results;
        };

        return factory;
    }]);