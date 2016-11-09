(function () {
	angular.module("wordStormApp.components")
	.directive("listableData", Directive);
	
	function Directive(){
		 return {
	    	restrict: 'E',
	    	templateUrl: 'angular/components/listable-data/listable-data.directive.html',
	    	controller: DirectiveController,
	    	controllerAs: 'ctrl',
	    	bindToController: true,
	    	scope: {
	    		list: '=',
	    		groupField: '@',
	    		refreshDataAction: '&',
	    		displayDirectiveName: '@',
	    		displayDirectiveParameters: '=',
	    		filterFunction: '=',
	    		view: '@'
	    	},
	    	transclude:{
	    		errors: '?fieldErrors'
	    	}
	    };
	}
	var viewModes = {
		LIST: "list",
		GRID: "grid"
	};
	
	DirectiveController.$inject = [];
	function DirectiveController(){
		var ctrl = this;
		var searchMode = false;
		ctrl.viewMode = ctrl.view != null ? ctrl.view : viewModes.LIST;
		
		ctrl.isSearchModeOn = isSearchModeOn;
		ctrl.switchSearchMode = switchSearchMode;
		ctrl.searchText = null;
		
		ctrl.switchToViewMode = switchToViewMode;
		ctrl.isListMode = isListMode;
		ctrl.isGridMode = isGridMode;
		ctrl.createDirectiveForItem = createDirectiveForItem;
		ctrl.filterItems = filterItems;
		
		/////////////////////////
		
		function isSearchModeOn(){
			return searchMode;
		}
		
		function switchSearchMode(){
			ctrl.searchText = null;
			searchMode = !searchMode;
		}
		
		function switchToViewMode(mode){
			ctrl.viewMode = mode;
		}
		
		function isListMode(){
			return ctrl.viewMode == viewModes.LIST;
		}
		
		function isGridMode(){
			return ctrl.viewMode == viewModes.GRID;
		}
		
		function createDirectiveForItem(item){
			var result = "<" + ctrl.displayDirectiveName;
			result += " search-text='ctrl.searchText'";
			result += " parameters='ctrl.displayDirectiveParameters'";
			result += " mode='ctrl.viewMode'";
			result += " item='item'";
			result += "></" + ctrl.displayDirectiveName + ">";
			return result;
		}
		
		function filterItems(item){
			if(ctrl.filterFunction != null && ctrl.searchText != null  && ctrl.searchText.length > 0){
				return ctrl.filterFunction(item, ctrl.searchText);
			}
			return true;
		}
	}
}());