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
	
	DirectiveController.$inject = ['pages', 'config', 'userPanelService'];
	function DirectiveController(pages, config, userPanelService){
		var ctrl = this;
		var checkingPersonLogged = false;
		ctrl.ngModelOptions = null;
		
		ctrl.goToHome = goToHomeState;
		ctrl.displayDevMode = config.devMode == true;
		ctrl.displaySearchBar = config.searchUrl != null;
		ctrl.displayLanguageChange = getAvailableLanguages() != null && getAvailableLanguages().length > 1;
		ctrl.getAvailableLanguages = getAvailableLanguages;
		ctrl.isLoading = isLoading;
	
		init();
		
		///////////////////////////
		
		function init(){
			ctrl.ngModelOptions = initNgModelOptions();
			
			checkingPersonLogged = true;
			userPanelService.checkPersonLogged().then(function(){
				checkingPersonLogged = false;
			});
		}
		
		function initNgModelOptions(){
			return { 
				debounce : config.defaultDebounceTimeInMs
			};
		}
		function isLoading(){
			return checkingPersonLogged;
		}
		
		function goToHomeState(){
			pages.home();
		}
		
		function getAvailableLanguages(){
			return config.allowedLanguages;
		}
	}
}());