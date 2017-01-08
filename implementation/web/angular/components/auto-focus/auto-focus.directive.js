(function () {
	angular.module("wordStormApp.components")
	.directive("autoFocus", Directive);
	
	Directive.$inject = ["$timeout"];
	function Directive($timeout){
		 return {
	        link: function ( scope, element, attrs ) {
	        	$timeout( function () { 
	        		var confirmAutoFocus = attrs.useAutoFocus;
	        		if(confirmAutoFocus == "true"){
	        			element[0].focus(); 
	        		}
	        	});
	        }
	    };
	}
}());