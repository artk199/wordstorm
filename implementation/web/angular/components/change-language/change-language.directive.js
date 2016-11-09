(function () {
	angular.module("wordStormApp.components")
	.directive("changeLanguage", Directive);
	
	function Directive(){
		 return {
	    	restrict: 'E',
	    	templateUrl: 'angular/components/change-language/change-language.directive.html',
	    	controller: DirectiveController,
	    	controllerAs: 'ctrl',
	    	bindToController: true,
	    	scope: {
	    		availableLanguages: '='
	    	}
	    };
	}
	
	DirectiveController.$inject = ['$translate'];
	function DirectiveController($translate){
		var ctrl = this;
		
		ctrl.changeLanguage = changeLanguage;
		ctrl.isActiveLanguage = isActiveLanguage;
		
		////////////////////////////////
		
		function changeLanguage(lang){
			 $translate.use(lang);
		}
		
		function isActiveLanguage(lang){
			return lang == $translate.use();
		}
	}
}());