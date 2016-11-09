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
	    		headerClass: '@',
	    		bodyClass: '@',
	    		isLoading: '=',
	    		scrollableBody: '='
	    	},
	    	transclude: {
	    		header: '?pageHeader',
	    		headerLeft: '?pageHeaderLeft',
	    		headerRight: '?pageHeaderRight',
	    		body: 'pageBody',
	    		footer: '?pageFooter'
	    	}
	    };
	}
	
	DirectiveController.$inject = ['$transclude'];
	function DirectiveController($transclude){
		var ctrl = this;
		
		ctrl.isTranscludeGiven = isTranscludeGiven;
		ctrl.showHeader = showHeader;
		
		//////////////////
		
		function isTranscludeGiven(slot){
			return $transclude.isSlotFilled(slot);
		}
		
		function showHeader(){
			return isTranscludeGiven('header') 
				|| isTranscludeGiven('headerLeft') 
				|| isTranscludeGiven('headerRight');
		}
	}
}());