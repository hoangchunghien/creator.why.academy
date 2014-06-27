angular.module('creator.string.service', [

]) 
	.factory('stringSrv', function () {

		var factory = {};

		factory.findAll = function (pattern, string) {
			var result = [];
			var match = pattern.exec(string);
			var i = 0;
			while (match != null) {
				result[i++] = match[1];
    			match = pattern.exec(string);
			}
			return result;
		};

		return factory;
	});