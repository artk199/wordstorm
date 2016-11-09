(function () {
	angular.module("wordStormApp.components")
	.directive("userPanel", Directive);
	
	function Directive(){
		 return {
	    	restrict: 'E',
	    	templateUrl: 'angular/components/user-panel/user-panel.directive.html',
	    	controller: DirectiveController,
	    	controllerAs: 'ctrl',
	    	bindToController: true,
	    	scope: {
	    		open: '='
	    	}
	    };
	}
	
	var views = {
		LOG_IN_FORM : "angular/components/user-panel/views/form.html",
		LOGGED_IN : "angular/components/user-panel/views/logged-in.html"
	}
	
	DirectiveController.$inject = ['userPanelService', 'pages'];
	function DirectiveController(userPanelService, pages){
		var ctrl = this;
		var isPersonLoggedLoading = false;
		
		ctrl.view = views.LOG_IN_FORM;
		
		ctrl.loggingInProcess = false;
		ctrl.errors = null;
		
		ctrl.isLoading = isLoading;
		ctrl.logIn = logPersonIn;
		ctrl.logOut = logPersonOut;
		ctrl.isPersonLogged = isPersonLogged;
		ctrl.goToRegisterPage = pages.register;
		
		init();
		
		///////////////////////////
		
		function init(){
			refreshIsPersonLogged();
		}
		
		function isPersonLogged(){
			return views.LOGGED_IN == ctrl.view;
		}
		
		function refreshIsPersonLogged(){
			isPersonLoggedLoading = true;
			userPanelService.checkPersonLogged().then(function(){
				ctrl.view = userPanelService.isPersonLogged() ? views.LOGGED_IN : views.LOG_IN_FORM;
				isPersonLoggedLoading = false;
			});
		}
		
		function isLoading(){
			return isPersonLoggedLoading;
		}
		
		function logPersonIn(email, password){
			ctrl.loggingInProcess = true;
			ctrl.errors = null;
			userPanelService.logPersonIn(email, password).then(function(result){
				// Services logic returned error
				if(!result || result.responseError != null){
					ctrl.errors = {WrongUsernameOrPassword : true};
				}
				else{
					ctrl.view = views.LOGGED_IN;
				}

				ctrl.loggingInProcess = false;
			});
		}
		
		function logPersonOut(){
			userPanelService.logPersonOut().then(function(){
				ctrl.view = views.LOG_IN_FORM;
				pages.home();
			});
		}
	}
}());