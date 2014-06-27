
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
        var dictApi = "http://en.wiktionary.org/w/api.php?action=parse&format=json&prop=text&callback=?&page=";
        var factory = {};

        factory.findAll = function (word, successCallback) {
        	$.getJSON(dictApi + word,  function(json) {
        		var text = json.parse.text['*'];
            	var phoneticPt = /<span\sclass="IPA"\slang="">\/(.*?)\/<\/span>/g;
            	var phonetics = stringSrv.findAll(phoneticPt, text);

                successCallback(phonetics);
        	});
            
        };

        return factory;
    }]);