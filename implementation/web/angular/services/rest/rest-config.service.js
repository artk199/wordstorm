(function () {
	angular.module("wordStormApp.services")
	.service("restConfig", Service);
	
	Service.$inject = ['config', '$q', '$http', 'cookies', 'restMock'];
	function Service(config, $q, $http, cookies, restMock){
		var service = this;
		
		service.createGetPromise = createGetPromise;
		service.createPostPromise = createPostPromise;
		
		///////////////////
		
		function createGetPromise(url, parameters, skipDefaultParameters){
			return $http.get(config.restApi + url,
					skipDefaultParameters != true ? addStandardHeaders(parameters) : parameters);
		}
		
		function createPostPromise(url, data, parameters, skipDefaultParameters){
			return $http.post(config.restApi + url, angular.toJson(data), 
					skipDefaultParameters != true ? addStandardHeaders(parameters) : parameters);
		}
		
		function addStandardHeaders(parameters){
			var params = parameters || {};
			params.headers = params.headers || {};
			params.headers['Content-Type'] = params.headers['Content-Type'] || 'application/json';
			params.headers['Authorization'] = params.headers['Authorization'] || cookies.credentials.createHeader();
			return params;
		}
	}
}());