(function () {
	angular.module("wordStormApp.components")
	.directive("page", Directive);
	
	function Directive(){
		 return {
	    	restrict: 'E',
	    	templateUrl: 'angular/components/page/page.directive.html',
	    	controller: DirectiveController,
	    	controllerAs: 'ctrl',
	    	bindToController: true,
	    	scope: {
	    		backgroundImage: '@',
	    		pageClass: '@',
	    		bodyClass: '@'
	    	},
	    	transclude: true
	    };
	}
	
	DirectiveController.$inject = [];
	function DirectiveController(){
		var ctrl = this;
	}
}());