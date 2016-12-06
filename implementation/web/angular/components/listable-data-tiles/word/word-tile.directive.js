(function () {
	angular.module("wordStormApp.components")
	.directive("wordTile", Directive);
	
	function Directive(){
		 return {
	    	restrict: 'E',
	    	templateUrl: 'angular/components/listable-data-tiles/word/word-tile.directive.html',
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
		GRID: 'angular/components/listable-data-tiles/word/views/word-tile-grid-view.html',
		LIST: 'angular/components/listable-data-tiles/word/views/word-tile-list-view.html'
	};
	
	var modes = {
		REMOVE: "remove",
		EXPANDED: "expanded"
	};
	
	var loadingData = {
		REMOVING_COLLECTION: false
	};
	
	DirectiveController.$inject = ['pages', 'rest'];
	function DirectiveController(pages, rest){
		var ctrl = this;
		var actionMode = null;
		
		ctrl.isRemoveMode = isRemoveMode;
		ctrl.isNormalMode = isNormalMode;
		ctrl.isExpandedMode = isExpandedMode;
		ctrl.switchToRemoveMode = switchToRemoveMode;
		ctrl.switchToNormalMode = switchToNormalMode;
		ctrl.switchToEditMode = switchToEditMode;
		ctrl.switchExpandedMode = switchExpandedMode;
		ctrl.removeItem = removeItem;
		ctrl.isRemoving = isRemoving;
		ctrl.openWord = openWord;
		ctrl.getViewForMode = getViewForMode;
		ctrl.selectItem = selectItem;
		ctrl.isItemSelected = isItemSelected;
		
		////////////////////////
		
		function getViewForMode(){
			var result = null;
			switch(ctrl.mode){
				case "list": result = views.LIST; break;
				default: result = views.GRID;
			}
			return result;
		}
		
		function isRemoveMode(){
			return actionMode == modes.REMOVE;
		}
		
		function isNormalMode(){
			return actionMode == null;
		}
		
		function isExpandedMode(){
			return actionMode == modes.EXPANDED;
		}
		
		function switchToRemoveMode(){
			actionMode = modes.REMOVE;
		}
		
		function switchToNormalMode(){
			actionMode = null;
		}
		
		function switchExpandedMode(){
			if(isExpandedMode()){
				switchToNormalMode();
			}
			else{
				actionMode = modes.EXPANDED;
			}
		}
		
		function removeItem(){
			loadingData.REMOVING_COLLECTION = true;
			
			rest.word.remove([ctrl.item.Id]).then(function(result){
				if(ctrl.parameters != null && ctrl.parameters.removeItem != null){
					ctrl.parameters.removeItem(ctrl.item.Id);
				}
				loadingData.REMOVING_COLLECTION = false;
			});
		}
		
		function isRemoving(){
			return loadingData.REMOVING_COLLECTION;
		}
		
		function switchToEditMode(){
			pages.word.edit(ctrl.item.Id, ctrl.item.Word);
		}
		
		function openWord(){
			if(actionMode == null){
				pages.word.show(ctrl.item.Id, ctrl.item.Word);
			}
		}
		
		function selectItem(){
			if(ctrl.parameters != null && ctrl.parameters.selectedItems != null){
				var position = ctrl.parameters.selectedItems.indexOf(ctrl.item.Id);
				if(position < 0){
					ctrl.parameters.selectedItems.push(ctrl.item.Id);
				}
				else{
					ctrl.parameters.selectedItems.splice(position, 1);
				}
			}
		}
		
		function isItemSelected(){
			if(ctrl.parameters != null && ctrl.parameters.selectedItems != null){
				var position = ctrl.parameters.selectedItems.indexOf(ctrl.item.Id);
				return position >=0;
			}
			return false;
		}
	}
}());