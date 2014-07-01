
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
            	var pron = doc.getElementsByClassName('ei-g')[0];
                var phonetic = pron.getElementsByClassName('y')[0].innerHTML;

                successCallback([phonetic]);
        	});
            
        };

        return factory;
    }]);