(function () {
	angular.module("wordStormApp.pages")
	.directive("myLibraryPage", Directive);
	
	function Directive(){
		 return {
	    	restrict: 'E',
	    	templateUrl: 'angular/pages/my-library/my-library-page.directive.html',
	    	controller: DirectiveController,
	    	controllerAs: 'ctrl',
	    	bindToController: true,
	    	scope: {}
	    };
	}
	
	var loadingData = {
		COLLECTION_LIST: false,
		REMOVING_SELECTED: false
	};
	
	DirectiveController.$inject = ['$stateParams', 'rest', 'pages', '$translate', 'config', 'alerts'];
	function DirectiveController($stateParams, rest, pages, $translate, config, alerts){
		var ctrl = this;

		ctrl.collection = null;
		ctrl.isLoading = isLoading;
		
		ctrl.addCollection = pages.myLibrary.addCollection;
		ctrl.refreshCollectionsList = refreshCollectionsList;
		ctrl.collectionListFilter = collectionListFilter;
			
		ctrl.parametersForCollectionsList = initParametersForCollectionsList();	
		ctrl.listableDataEvents = initListableDataEvents();
		
		ctrl.isAnyCollectionSelected = isAnyCollectionSelected;
		ctrl.isRemovingSelected = isRemovingSelected;
		ctrl.removeSelectedCollections = removeSelectedCollections;
		
		init();
		
		//////////////////
		function init(){
			refreshCollectionsList(null, null, true);
		}
		
		function refreshCollectionsList(pageSize, pageNumber, useCache, forceReload){
			loadingData.COLLECTION_LIST = true;
			return rest.collection.getAll(pageSize, pageNumber, useCache, forceReload).then(function(data){
				if(data.Result != null){
					ctrl.collection = data.Result;
				}
				loadingData.COLLECTION_LIST = false;
			});
		}
		
		function initParametersForCollectionsList(){
			return {
				removeCollection: silentRemoveCollection,
				editCollection: silentEditCollection,
				selectedCollections: []
			}
		}
		
		function silentRemoveCollection(collectionId){
			// Remove collection from local store
			for(var i = 0; i < ctrl.collection.length; i++){
				if(ctrl.collection[i].Id == collectionId){
					ctrl.collection.splice(i, 1);
				}
			}
			
			// Refresh promise from cache
			return rest.collection.getAll(null, null, true, true);
		}
		
		function silentEditCollection(collection){		
			// Refresh promise from cache
			return rest.collection.getAll(null, null, true, true);
		}
		
		function isLoading(){
			return loadingData.COLLECTION_LIST;
		}
		
		function collectionListFilter(item, searchText){
			var text = clearText(searchText);
			var keywords = text.split(" ");
			
			for(var i = 0; i < keywords.length; i++){
				var keyword = keywords[i];
				
				var itemName = clearText(item.Name);
				if(itemName.indexOf(keyword) >= 0){
					continue;
				}
				
				var totalWords = item.TotalWords, totalKnownWords = item.TotalKnownWords;
				if(keyword == totalWords || keyword == totalKnownWords){
					continue;
				}
				
				var itemPrivatePolicy = item.IsPublic;
				var policy = itemPrivatePolicy ? clearText($translate.instant("myLibrary.collections.public")) 
						: clearText($translate.instant("myLibrary.collections.private"));
				if(policy.indexOf(keyword) >= 0){
					continue;
				}
				
				return false;
			}
			return true;
		}
		
		function clearText(text){
			return text != null ? text.toString().toLowerCase().replace(/\s+/g, " ") : "";
		}
		
		function openCollection(collection){
			pages.myLibrary.collection(collection.Id, collection.Name);
		}
		
		// ===== Removing selected =====
		function initListableDataEvents(){
			return {
				onViewChange: function(){ ctrl.parametersForCollectionsList.selectedCollections = []; }
			}
		}
		
		function isRemovingSelected(){
			return loadingData.REMOVING_SELECTED;
		}
		
		function isAnyCollectionSelected(){
			return ctrl.parametersForCollectionsList.selectedCollections.length > 0;
		}
		
		function removeSelectedCollections(){
			var selectedCollections = ctrl.parametersForCollectionsList.selectedCollections;
			loadingData.REMOVING_SELECTED = true;
			
			rest.collection.removeList(selectedCollections).then(function(result){
				if(result.Result){
					alerts.addGlobalAlert({
						title: 'messages.collections.remove.success',
						titleParams: {collectionsCount: selectedCollections.length},
						type: 'success'
					});
					ctrl.parametersForCollectionsList.selectedCollections.length = 0;
				}
				refreshCollectionsList(null, null, true, true);
				loadingData.REMOVING_SELECTED = false;
			});
		}
	}
}());