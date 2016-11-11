(function () {
	angular.module("wordStormApp.components")
	.directive("errorPage", Directive);
	
	function Directive(){
		 return {
	    	restrict: 'E',
	    	templateUrl: 'angular/pages/error/error-page.directive.html',
	    	controller: DirectiveController,
	    	controllerAs: 'ctrl',
	    	bindToController: true,
	    	scope: {}
	    };
	}
	
	DirectiveController.$inject = ['$stateParams'];
	function DirectiveController($stateParams){
		var ctrl = this;
		ctrl.error = $stateParams.error;
		
		ctrl.errorInfo = parseError();
		
		//////////////////////
		function parseError(){
			var error = angular.copy(ctrl.error);
			error.stackTrace = error.stackTrace != null ? error.stackTrace.split("\n") : undefined;
			return JSON.stringify(error, undefined, 5);
		}
	}
}());