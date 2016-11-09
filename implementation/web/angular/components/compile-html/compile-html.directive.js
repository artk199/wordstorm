(function () {
	angular.module("wordStormApp.components")
	.directive("compileHtml", Directive);
	
	Directive.$inject = ['$compile'];
	function Directive($compile){
		return {
			restrict: 'E', 
		    replace: true,
		    link: function(scope, element, attrs) {
		    	var template = $compile(attrs.html)(scope);
		    	element.replaceWith(template);               
		    }
		};
	}
}());