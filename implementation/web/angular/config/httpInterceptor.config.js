(function () {
	angular.module("wordStormApp")
	.factory("httpInterceptor", HttpInterceptor);
	
	var RESPONSE_ERROR_STATUS = 422;
	
	HttpInterceptor.$inject = ['$q', '$injector'];
	function HttpInterceptor($q, $injector){
		var pages;
		
		return {		  
		    request: function(config) {
		      return config;
		    },

		    requestError : function(config) {
		      return config;
		    },

		    response : function(response) {
		    	 if (response.config.method == "GET" && 
		    			 response.config.url.split(".").pop() == "html"){
		    		  return response;
		    	 }
			          
			     return response.data;
		    },

		    responseError : function(res) {
		    	pages = pages || $injector.get('pages');
		    	
		    	switch(res.status){
		    		// In case of error from services' logic, just return errors
		    		case RESPONSE_ERROR_STATUS:
		    			return res.data ? {responseError: res.data.Errors} : null;
	    			break;
	    			default: 
	    				var error = {
				    		type: "Problem with services",
				    		data: res.data,
				    		status : res.status,
				    		statusText : res.statusText,
				    		url : res.config.url,
				    		method : res.config.method,
				    		headers : res.config.headers
				    	};
				    	
				    	pages.error(error);
		    	}
		    }
		};
	}
}());