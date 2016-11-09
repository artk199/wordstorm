(function () {
	angular.module("wordStormApp")
	.config(function($provide) {
	    $provide.decorator("$exceptionHandler", 
	     ['$delegate', '$injector',
	     function($delegate, $injector) {
	    	var pages;
	    	 
	        return function(exception, cause) {   	
	            $delegate(exception, cause);
	            pages = pages || $injector.get('pages');
	            
	            if(pages != null && !pages.isPageOpened('error')){
	                var errorMessage = {};
	 	            errorMessage.message = exception.message;
	 	            errorMessage.stackTrace = exception.stack;
	 	            
	 	            pages.error({error: errorMessage});
	            }
	        };
	    }]);
	});
}());