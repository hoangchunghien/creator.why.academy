/**
 * Created by Hien on 5/31/2014.
 */

angular.module('creator.api.service', [

])
    .factory('api', function() {
        var factory = {};
        factory.serverPath = function() {
            if (window.location.hostname === "localhost") {
                return "http://localhost:8080";
            }
            else {
                return "http://api.why.academy";
            }
        };
        return factory;
    });