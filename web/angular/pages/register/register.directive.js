(function () {
	angular.module("wordStormApp.components")
	.directive("registerPage", Directive);
	
	function Directive(){
		 return {
	    	restrict: 'E',
	    	templateUrl: 'angular/pages/register/register.directive.html',
	    	controller: DirectiveController,
	    	controllerAs: 'ctrl',
	    	bindToController: true,
	    	scope: {}
	    };
	}
	
	DirectiveController.$inject = [];
	function DirectiveController(){
		var ctrl = this;
		
		ctrl.userData = initUserData();
		
		/////////////////////
		
		function initUserData(){
			return {
				email: null,
				password: null,
				confirmPassword: null
			}
		}
	}
}());