(function () {
	angular.module("wordStormApp.components")
	.directive("autoFocus", Directive);
	
	Directive.$inject = ["$timeout"];
	function Directive($timeout){
		 return {
	        link: function ( scope, element, attrs ) {
	        	var confirmAutoFocus = attrs.useAutoFocus;
	        	if(confirmAutoFocus){
	        		$timeout( function () { element[0].focus(); } );
	        	}
	        }
	    };
	}
}());