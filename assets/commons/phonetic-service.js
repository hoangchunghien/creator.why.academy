
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
        var dictApi = "http://www.oxforddictionaries.com/definition/english/";
        var factory = {};

        factory.findAll = function (word, successCallback) {
        	$.get(dictApi + word,  function(data) {
                var text = data.responseText.trim();
            	var phoneticPt = /<div class="headpron"><a.*>.*<\/a>\n<p>\/(.*)<\/p>/mg;
            	var phonetics = stringSrv.findAll(phoneticPt, text);

                successCallback(phonetics);
        	});
            
        };

        return factory;
    }]);