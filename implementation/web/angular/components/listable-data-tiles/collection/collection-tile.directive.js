(function () {
	angular.module("wordStormApp.components")
	.directive("collectionTile", Directive);
	
	function Directive(){
		 return {
	    	restrict: 'E',
	    	templateUrl: 'angular/components/listable-data-tiles/collection/collection-tile.directive.html',
	    	controller: DirectiveController,
	    	controllerAs: 'ctrl',
	    	bindToController: true,
	    	scope: {
	    		item: '=',
	    		parameters: '=',
	    		searchText: '=',
	    		mode: '='
	    	}
	    };
	}
	
	var views = {
		GRID: 'angular/components/listable-data-tiles/collection/views/collection-tile-grid-view.html',
		LIST: 'angular/components/listable-data-tiles/collection/views/collection-tile-list-view.html'
	};
	
	var modes = {
		REMOVE: "remove",
		EDIT: "edit"
	};
	
	DirectiveController.$inject = ['pages'];
	function DirectiveController(pages){
		var ctrl = this;
		var mode = null;
		
		ctrl.getProgress = getProgress;
		ctrl.openCollection = openCollection;
		ctrl.getModeInclude = getModeInclude;
		ctrl.isRemoveMode = isRemoveMode;
		ctrl.openRemoveMode = openRemoveMode;
		ctrl.openEditMode = openEditMode;
		ctrl.isEditMode = isEditMode;
		ctrl.switchToNormalMode = switchToNormalMode;
		ctrl.formData = null;
		
		/////////////////////
		
		function getProgress(){
			var result = ctrl.item.TotalWords > 0 ?
					1.0 * ctrl.item.TotalKnownWords / ctrl.item.TotalWords
					: 1;
			return result;
		}
		
		function openCollection(collection){
			if(mode == null){
				pages.myLibrary.collection(collection.Id, collection.Name, collection);
			}
		}
		
		function getModeInclude(){
			return ctrl.mode == "list" ? views.LIST : views.GRID;
		}
		
		function isRemoveMode(){
			return modes.REMOVE == mode;
		}
		
		function isEditMode(){
			return modes.EDIT == mode;
		}
		
		function openRemoveMode(){
			mode = modes.REMOVE;
		}
		
		function openEditMode(){
			mode = modes.EDIT;
			ctrl.formData = {
				Name: ctrl.item.Name
			};
		}
		
		function switchToNormalMode(){
			mode = null;
			ctrl.formData = null;
		}
	}
}());