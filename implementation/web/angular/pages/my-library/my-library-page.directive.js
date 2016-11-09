(function () {
	angular.module("wordStormApp.components")
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
		COLLECTION_LIST : false
	};
	
	var views = {
		ALL_COLLECTIONS: "angular/pages/my-library/views/my-library-all-collections.html",
		ADD_COLLECTION:  "angular/pages/my-library/views/my-library-add-collection.html"
	};
	
	DirectiveController.$inject = ['$stateParams', 'rest', 'pages'];
	function DirectiveController($stateParams, rest, pages){
		var ctrl = this;
		
		ctrl.params = $stateParams;
		ctrl.view = views.ALL_COLLECTIONS;
		ctrl.addCollectionFormData = initAddCollectionFormData();
		ctrl.formSending = false;
		
		ctrl.collection = null;
		ctrl.isLoading = isLoading;
		ctrl.addCollection = addCollection;
		ctrl.showAllCollections = showAllCollections;
	
		ctrl.clearForm = clearForm;
		ctrl.sendAddCollectionRequest = sendAddCollectionRequest;
		
		ctrl.refreshCollectionsList = refreshCollectionsList;
		ctrl.collectionListFilter = collectionListFilter;
			
		init();
		
		//////////////////
		function init(){
			if($stateParams.params != null && $stateParams.params.groupId != null){
				
			}
			else{
				ctrl.view = views.ALL_COLLECTIONS;
				refreshCollectionsList(null, null, true);
			}
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
		
		function isLoading(){
			return loadingData.COLLECTION_LIST;
		}
		
		function addCollection(){
			ctrl.view = views.ADD_COLLECTION;
		}
		
		function showAllCollections(){
			ctrl.view = views.ALL_COLLECTIONS;
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
				
				return false;
			}
			return true;
		}
		
		function clearText(text){
			return text != null ? text.toString().toLowerCase().replace(/\s+/g, " ") : "";
		}
		
		function openCollection(collection){
			pages.myLibrary.collection(collection.Id, collection.Name, collection);
		}
		
		// ===== Add collection functions =====
		function initAddCollectionFormData(){
			return {
				Name: null,
				IsPublic: false
			};
		}
		
		function clearForm(form){
			form.$setPristine();
			form.$setUntouched();
			ctrl.addCollectionFormData = initAddCollectionFormData();
		}
		
		function sendAddCollectionRequest(form){
			ctrl.formSending = true;
			
			rest.collection.create([ctrl.addCollectionFormData]).then(function(result){
				var collection = result[0];
				openCollection(collection);
			});
			
			clearForm(form);
			ctrl.formSending = false;
		}
	}
}());