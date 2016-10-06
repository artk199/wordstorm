(function () {
	angular.module("wordStormApp.services")
	.service("rest", Service);
	
	Service.$inject = ['config', '$q', '$http', 'restMock'];
	function Service(config, $q, $http, restMock){
		var service = this;
		
		service.person = {
			isPersonLogged: isPersonLogged,
			logPersonIn: logPersonIn,
			logPersonOut: logPersonOut
		};
		
		//////////////////////////////
		// General functions
		function getPromise(url){
			return $http.get(config.restApi + url);
		}
		
		function createPostPromise(url, data, parameters){
			return $http.post(config.restApi + url, angular.toJson(data), addStandardPostHeaders(parameters));
		}
		
		function addStandardPostHeaders(parameters){
			var params = parameters || {};
			params.headers = params.headers || {};
			params.headers['Content-Type'] = params.headers['Content-Type'] || 'application/json';
			return params;
		}
		
		// Rest functions
		function isPersonLogged(){
			return restMock.isPersonLogged();
		}
		
		function logPersonIn(email, password){
			return restMock.logPersonIn(email, password);
		}
		
		function logPersonOut(email){
			return restMock.logPersonOut(email);
		}
	}
}());