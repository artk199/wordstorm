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
	    		view: '@',
	    		noViewChange: '=',
	    		scrollableBody: '=',
	    		events: '=',
	    		pagination: '='
	    	},
	    	transclude:{
	    		listEmpty: '?listableDataEmptyList',
	    		headerRight: '?listableDataHeaderRight'
	    	}
	    };
	}
	
	var viewModes = {
		LIST: "list",
		GRID: "grid"
	};
	
	DirectiveController.$inject = ['settings'];
	function DirectiveController(settings){
		var ctrl = this;
		var searchMode = false;
		
		ctrl.viewMode = ctrl.view != null ? ctrl.view : getDefaultListView();
		
		ctrl.isSearchModeOn = isSearchModeOn;
		ctrl.switchSearchMode = switchSearchMode;
		ctrl.searchText = null;
		
		ctrl.switchToViewMode = switchToViewMode;
		ctrl.isListMode = isListMode;
		ctrl.isGridMode = isGridMode;
		ctrl.createDirectiveForItem = createDirectiveForItem;
		ctrl.filterItems = filterItems;
		ctrl.listCurrentPage = null;
		ctrl.filteredList = null;
		
		ctrl.getMaxListSize = getMaxListSize;
		ctrl.getListStartItem = getListStartItem;
		ctrl.refreshPagination = refreshPagination;
		
		init();
		
		/////////////////////////
		
		function init(){
			refreshPagination();
		}
		
		function refreshPagination(){
			ctrl.listCurrentPage = 1;
		}
		
		function isSearchModeOn(){
			return searchMode;
		}
		
		function switchSearchMode(){
			ctrl.searchText = null;
			searchMode = !searchMode;
		}
		
		function switchToViewMode(mode){
			ctrl.viewMode = mode;
			settings.DEFAULT_LIST_TYPE.set(mode);
			if(ctrl.events != null && ctrl.events.onViewChange != null){
				ctrl.events.onViewChange(mode);
			}
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
			result += " index='$index'";
			result += "></" + ctrl.displayDirectiveName + ">";
			return result;
		}
		
		function filterItems(item){
			if(ctrl.filterFunction != null && ctrl.searchText != null  && ctrl.searchText.length > 0){
				return ctrl.filterFunction(item, ctrl.searchText);
			}
			return true;
		}
		
		function getDefaultListView(){
			return settings.DEFAULT_LIST_TYPE.get();
		}
		
		function getMaxListSize(){	
			var result = ctrl.list.length;
			if(ctrl.pagination != null && ctrl.pagination.maxSize != null){
				result = ctrl.pagination.maxSize;
			}
			return result;
		}
		
		function getListStartItem(){
			var result = null;
			if(ctrl.pagination != null && ctrl.pagination.maxSize != null){
				result = (ctrl.listCurrentPage - 1) * ctrl.pagination.maxSize;
			}
			return result;
		}
	}
}());