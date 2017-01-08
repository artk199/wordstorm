(function () {
	angular.module("wordStormApp.components")
	.directive("wordCard", Directive);
	
	function Directive(){
		 return {
	    	restrict: 'E',
	    	templateUrl: 'angular/components/word-card/word-card.directive.html',
	    	controller: DirectiveController,
	    	controllerAs: 'ctrl',
	    	bindToController: true,
	    	scope: {
	    		word: '=',
	    		view: '='
	    	}
	    };
	}
	
	var views = {
		WORD: "word",
		TRANSLATION: "translation"
	};
	
	DirectiveController.$inject = [];
	function DirectiveController(){
		var ctrl = this;
		
		ctrl.switchToAnotherView = switchToAnotherView;
		
		init();
		
		///////////////////////
		
		function init(){
			ctrl.view = views.WORD;
		}
		
		function switchToAnotherView(){
			var nextView = ctrl.view == views.WORD ? views.TRANSLATION : views.WORD;
			ctrl.view = nextView;
		}
	}
}());