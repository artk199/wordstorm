(function () {
	angular.module("wordStormApp.components")
	.directive("wordSearch", Directive);
	
	function Directive(){
		 return {
	    	restrict: 'E',
	    	templateUrl: 'angular/components/word-search/word-search.directive.html',
	    	controller: DirectiveController,
	    	controllerAs: 'ctrl',
	    	bindToController: true,
	    	scope: {}
	    };
	}
	
	DirectiveController.$inject = ['config', '$window'];
	function DirectiveController(config, $window){
		var ctrl = this;
		var baseUrl = config.searchUrl;
		
		ctrl.word = null;
		
		ctrl.findWord = findWord;
		
		///////////////////
		
		function findWord(){
			if(ctrl.word){
				$window.open(baseUrl + ctrl.word);
			}
		}
	}
}());