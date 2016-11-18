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
	    		open: '=',
	    		closeSidebar: '&',
	    		openSidebar: '&'
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
		var isUserDataLoading = false;
		
		ctrl.view = views.LOG_IN_FORM;
		
		ctrl.loggingInProcess = false;
		ctrl.errors = null;
		
		ctrl.isLoading = isLoading;
		ctrl.logIn = logPersonIn;
		ctrl.logOut = logPersonOut;
		ctrl.isPersonLogged = isPersonLogged;
		ctrl.goToRegisterPage = pages.register;
		ctrl.userData = null;
		
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
			return userPanelService.checkPersonLogged().then(function(){
				var personLogged = userPanelService.isPersonLogged();
				// Automatically download user data if he is logged
				if(personLogged){
					refreshUserData();
				}
				ctrl.view = personLogged ? views.LOGGED_IN : views.LOG_IN_FORM;
				isPersonLoggedLoading = false;
			});
		}
		
		function refreshUserData(){
			isUserDataLoading = true;
			return userPanelService.loadPersonData().then(function(data){
				ctrl.userData = data;
				isUserDataLoading = false;
			});
		}
		
		function isLoading(){
			return isPersonLoggedLoading || isUserDataLoading;
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
					refreshUserData().then(function(){
						ctrl.view = views.LOGGED_IN;
						handleSidebar();
					});
				}

				ctrl.loggingInProcess = false;
			});
		}
		
		function logPersonOut(){
			userPanelService.logPersonOut().then(function(){
				ctrl.view = views.LOG_IN_FORM;
				pages.home();
				handleSidebar();
			});
		}
		
		function handleSidebar(){
			if(ctrl.closeSidebar){
				ctrl.closeSidebar();
			}
		}
	}
}());