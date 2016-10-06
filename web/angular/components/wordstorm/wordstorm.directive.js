(function () {
	angular.module("wordStormApp.components")
	.directive("wordStorm", Directive);
	
	function Directive(){
		 return {
	    	restrict: 'E',
	    	templateUrl: 'angular/components/wordstorm/wordstorm.directive.html',
	    	controller: DirectiveController,
	    	controllerAs: 'ctrl',
	    	bindToController: true,
	    	scope: {}
	    };
	}
	
	DirectiveController.$inject = ['pages', 'config'];
	function DirectiveController(pages, config){
		var ctrl = this;
		
		ctrl.goToHome = goToHomeState;
		ctrl.displayDevMode = config.devMode == true;
		ctrl.getAvailableLanguages = getAvailableLanguages;
		
		///////////////////////////
		
		function goToHomeState(){
			pages.home();
		}
		
		function getAvailableLanguages(){
			return config.allowedLanguages;
		}
	}
}());