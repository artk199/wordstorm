(function () {
	angular.module("wordStormApp.components")
	.directive("translationTile", Directive);
	
	function Directive(){
		 return {
	    	restrict: 'E',
	    	templateUrl: 'angular/components/listable-data-tiles/translation/translation-tile.directive.html',
	    	controller: DirectiveController,
	    	controllerAs: 'ctrl',
	    	bindToController: true,
	    	scope: {
	    		item: '=',
	    		parameters: '=',
	    		searchText: '=',
	    		index: "="
	    	}
	    };
	}
	
	var TRANSLATE_PREFIX = "enums.partOfSpeech.";
	
	DirectiveController.$inject = ['rest'];
	function DirectiveController(rest){
		var ctrl = this;
		var isEnumLoading = false;
		
		ctrl.removeTranslation = removeTranslation;
		ctrl.partOfSpeechEnum = null;
		
		init();
		
		////////////////////////
		
		function init(){
			refreshEnum();
		}
		
		function refreshEnum(){
			isEnumLoading = true;
			return rest.common.partOfSpeech().then(function(result){
				ctrl.partOfSpeechEnum = result.map(function(item){
					return TRANSLATE_PREFIX + item;
				});
				isEnumLoading = false;
			});
		}
		
		function isLoading(){
			return isEnumLoading;
		}
		
		function removeTranslation(){
			ctrl.parameters.list.splice(ctrl.index, 1);
		}
	}
}());