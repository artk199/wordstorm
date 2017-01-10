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
	    		reduceListFunction: '=',
	    		view: '@',
	    		noViewChange: '=',
	    		scrollableBody: '=',
	    		events: '=',
	    		noButtons: '=',
	    		noSearch: '=',
	    		addElement: '@'
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
	
	DirectiveController.$inject = ['settings', 'config'];
	function DirectiveController(settings, config){
		var ctrl = this;
		var searchMode = false;
		
		ctrl.viewMode = ctrl.view != null ? ctrl.view : getDefaultListView();
		ctrl.pagination = null;
		ctrl.scrollOptions = {};
		
		ctrl.isSearchModeOn = isSearchModeOn;
		ctrl.switchSearchMode = switchSearchMode;
		ctrl.searchText = null;
		
		ctrl.switchToViewMode = switchToViewMode;
		ctrl.isListMode = isListMode;
		ctrl.isGridMode = isGridMode;
		ctrl.createDirectiveForItem = createDirectiveForItem;
		ctrl.createControlDirective = createControlDirective;
		ctrl.filterItems = filterItems;
		ctrl.listCurrentPage = null;
		ctrl.filteredList = null;
		
		ctrl.getMaxListSize = getMaxListSize;
		ctrl.getListStartItem = getListStartItem;
		ctrl.refreshPagination = refreshPagination;
		
		ctrl.getAvailablePaginations = getAvailablePaginations;
		ctrl.updatePagination = updatePagination;
		ctrl.pageChanged = pageChanged;
		
		init();
		
		/////////////////////////
		
		function init(){
			refreshPagination();
			ctrl.pagination = settings.DEFAULT_LIST_PAGINATION.get();
		}
		
		function refreshPagination(){
			ctrl.listCurrentPage = 1;
		}
		
		function updatePagination(){
			refreshPagination();
			settings.DEFAULT_LIST_PAGINATION.set(ctrl.pagination);
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
		
		function createControlDirective(){
			var result = "<" + ctrl.displayDirectiveName;
			result += " parameters='ctrl.displayDirectiveParameters'";
			result += " mode='ctrl.viewMode'";
			result += " control-item='" + ctrl.addElement + "'";
			result += " item='item'";
			result += "></" + ctrl.displayDirectiveName + ">";
			return result;
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
			if(ctrl.reduceListFunction != null){
				var itemIsNotReduced = ctrl.reduceListFunction(item);
				if(itemIsNotReduced){
					if(ctrl.filterFunction != null && ctrl.searchText != null  && ctrl.searchText.length > 0){
						return ctrl.filterFunction(item, ctrl.searchText);
					}
				}
				return itemIsNotReduced;
			}
			if(ctrl.filterFunction != null && ctrl.searchText != null  && ctrl.searchText.length > 0){
				return ctrl.filterFunction(item, ctrl.searchText);
			}
			return true;
		}
		
		function getDefaultListView(){
			return settings.DEFAULT_LIST_TYPE.get();
		}
		
		function getMaxListSize(){	
			return ctrl.pagination || ctrl.list.length;
		}
		
		function getListStartItem(){
			var result = null;
			if(ctrl.pagination != null){
				result = (ctrl.listCurrentPage - 1) * ctrl.pagination;
			}
			return result;
		}
		
		function getAvailablePaginations(){
			return config.paginationSizes;
		}
		
		function pageChanged(){
			if(ctrl.scrollOptions.scrollTop){
				ctrl.scrollOptions.scrollTop(0);
			}
		}
	}
}());