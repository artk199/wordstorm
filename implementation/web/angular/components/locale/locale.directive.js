(function () {
	angular.module("wordStormApp.components")
	.directive("locale", Directive);
	
	Directive.$inject = ['$compile', 'config', '$translate'];
	function Directive($compile, config, $translate){
		return {
			priority:1001,
		    terminal:true,
			restrict: 'A', 
		    replace: true,
		    link: function(scope, element, attrs) {
		    	var useTranslate = config.allowedLanguages.length > 1;
		    	var locale = attrs.locale;
		    	if(locale){
		    		element.removeAttr("locale");
		    		if(useTranslate){
		    			element.attr("translate", locale);
		    		}
		    		else{
		    			var translated = $translate.instant(locale);
		    			element.text(translated);
		    		}
		    		
		    		var newElement = $compile(element)(scope);
    				element.replaceWith(newElement);        
		    	}           
		    }
		};
	}
}());