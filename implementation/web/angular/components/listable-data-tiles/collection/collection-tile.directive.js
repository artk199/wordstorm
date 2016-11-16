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
	
	var loadingData = {
		REMOVING_COLLECTION: false,
		EDITING_COLLECTION: false
	};
	
	DirectiveController.$inject = ['pages', 'rest'];
	function DirectiveController(pages, rest){
		var ctrl = this;
		var mode = null;
		
		ctrl.selected = false;
		ctrl.getProgress = getProgress;
		ctrl.openCollection = openCollection;
		ctrl.getModeInclude = getModeInclude;
		ctrl.isRemoveMode = isRemoveMode;
		ctrl.openRemoveMode = openRemoveMode;
		ctrl.openEditMode = openEditMode;
		ctrl.isEditMode = isEditMode;
		ctrl.switchToNormalMode = switchToNormalMode;
		ctrl.isNormalMode = isNormalMode;
		ctrl.formData = null;
		
		ctrl.removeCollection = removeCollection;
		ctrl.isCollectionRemoving = isCollectionRemoving;
		ctrl.editCollection = editCollection;
		ctrl.isCollectionEditing = isCollectionEditing;
		ctrl.hasCollectionChanged = hasChollectionChangedByEdit;
		ctrl.selectCollection = selectCollection;
		ctrl.isCollectionSelected = isCollectionSelected;
		
		ctrl.canDisplayActionButtons = canDisplayActionButtons;
		
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
				Name: ctrl.item.Name,
				IsPublic: ctrl.item.IsPublic,
				Id: ctrl.item.Id
			};
		}
		
		function switchToNormalMode(){
			mode = null;
			ctrl.formData = null;
		}
		
		function isNormalMode(){
			return mode == null;
		}
		
		function selectCollection(){
			if(ctrl.parameters != null && ctrl.parameters.selectedCollections != null){
				var position = ctrl.parameters.selectedCollections.indexOf(ctrl.item.Id);
				if(position < 0){
					ctrl.parameters.selectedCollections.push(ctrl.item.Id);
				}
				else{
					ctrl.parameters.selectedCollections.splice(position, 1);
				}
			}
		}
		
		function isCollectionSelected(){
			if(ctrl.parameters != null && ctrl.parameters.selectedCollections != null){
				var position = ctrl.parameters.selectedCollections.indexOf(ctrl.item.Id);
				return position >=0;
			}
			return false;
		}
		
		function canDisplayActionButtons(){
			return ctrl.parameters != null ? ctrl.parameters.readonly != true : true;
		}
		
		// ===== Removing collection functions =====
		function isCollectionRemoving(){
			return loadingData.REMOVING_COLLECTION;
		}
		
		function removeCollection(){
			// Dont allow for removing collection twice
			if(!loadingData.REMOVING_COLLECTION){
				loadingData.REMOVING_COLLECTION = true;
				
				rest.collection.remove(ctrl.item.Id).then(function(result){
					if(ctrl.parameters != null && ctrl.parameters.removeCollection != null){
						ctrl.parameters.removeCollection(ctrl.item.Id);
					}
					loadingData.REMOVING_COLLECTION = false;
				});
			}
		};
		
		// ===== Editing collection functions =====
		function isCollectionEditing(){
			return loadingData.EDITING_COLLECTION;
		}
		
		function editCollection(){
			// Dont allow for editing collection twice
			if(!loadingData.EDITING_COLLECTION){
				loadingData.EDITING_COLLECTION = true;
		
				rest.collection.edit([ctrl.formData]).then(function(result){
					if(ctrl.parameters != null && ctrl.parameters.editCollection != null){
						ctrl.parameters.editCollection(ctrl.item.Id);
					}
					
					saveEditedData();
					switchToNormalMode();
					loadingData.EDITING_COLLECTION = false;
				});
			}
		}
		
		function saveEditedData(){
			ctrl.item.Name = ctrl.formData.Name;
			ctrl.item.IsPublic = ctrl.formData.IsPublic;
		}
		
		function hasChollectionChangedByEdit(){
			return ctrl.item.Name != ctrl.formData.Name 
				|| ctrl.item.IsPublic != ctrl.formData.IsPublic;
		}
	}
}());