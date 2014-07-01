
/**
 * Created by Hien on June 27, 2014
 */

 angular.module('creator.phonetic.service', [
   'creator.string.service'
   ])
 .config(function($httpProvider) {
        //Enable cross domain calls
        $httpProvider.defaults.useXDomain = true;

        //Remove the header used to identify ajax call  that would prevent CORS from working
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    })
 .factory('phoneticSrv', ['$http', 'stringSrv', function ($http, stringSrv) {
    var dictApi = "http://www.oxfordlearnersdictionaries.com/definition/english/";
    var factory = {};

    factory.findAll = function (word, successCallback) {
       $.get(dictApi + word,  function(data) {
        var doc = new DOMParser().parseFromString(data.responseText,'text/xml');
        var childs = doc.getElementsByClassName('top-g')[0].childNodes;
        var phonetics = [];
        var continuous = false;
        for (var i = 0; i < childs.length; i++) {
            var child = childs[i];
            if (child.className == 'ei-g') {
                var phonetic = childs[i].getElementsByClassName('y')[0].innerHTML;
                phonetics[i] = phonetic;
                continuous = true;
            } else {
                if (continuous && child.nodeType !== child.TEXT_NODE)
                {
                    break;
                }
            }
        }

        successCallback(phonetics);
    });

   };

   return factory;
}]);