(function () {
	angular.module("wordStormApp")
	.factory("httpInterceptor", HttpInterceptor);
	
	var ERRORS = {
		RESPONSE: 422,
		AUTHORIZATION: 401,
		NOT_FOUND: 404
	};
	
	HttpInterceptor.$inject = ['$q', '$injector'];
	function HttpInterceptor($q, $injector){
		var pages;
		var userPanelService;
		
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
		    	userPanelService = userPanelService || $injector.get('userPanelService');
		    	
		    	switch(res.status){
		    		// In case of error from services' logic, just return errors
		    		case ERRORS.RESPONSE:
		    			return res.data ? {responseError: res.data.Errors} : null;
	    			break;
	    			// When user is accessing data he can't see, log him out and
	    			// show authorization error page
		    		case ERRORS.AUTHORIZATION:
		    			userPanelService.logPersonOut();
		    			pages.authError();
		    			
		    			// Return not-null object to lower risk of undefined errors
		    			return res || {};
		    		break;
		    		case ERRORS.NOT_FOUND:
		    			if(!pages.isPageOpened('error')){
	    					var error = {
    				    		type: "Resource could not be found",
    				    		status : res.status,
    				    		statusText : res.statusText,
    				    		url : res.config.url,
    				    		method : res.config.method,
    				    		headers : res.config.headers
    				    	};
    				    	
    				    	pages.error(error);
	    				}
	    			
				    	return {responseError: []};
		    		break;
	    			default: 
	    				if(!pages.isPageOpened('error')){
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
	    			
				    	return {responseError: []};
		    	}
		    }
		};
	}
}());