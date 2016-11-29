(function () {
	angular.module("wordStormApp.pages")
	.directive("collectionPage", Directive);
	
	function Directive(){
		 return {
	    	restrict: 'E',
	    	templateUrl: 'angular/pages/collection/collection-page.directive.html',
	    	controller: DirectiveController,
	    	controllerAs: 'ctrl',
	    	bindToController: true,
	    	scope: {
	    		view: '@'
	    	}
	    };
	}
	
	var views = {
		"add": "angular/pages/collection/views/collection-page-form.html",
		"edit": "angular/pages/collection/views/collection-page-form.html",
		"list": "angular/pages/collection/views/collection-page-words-list.html",
		"preview" : "angular/pages/collection/views/collection-page-preview.html"
	};
	
	var modes = {
		ADD : "add",
		EDIT: "edit",
		LIST: "list",
		PREVIEW: "preview"
	};
	
	DirectiveController.$inject = ['$stateParams', 'pages', 'rest', 'config', 'alerts'];
	function DirectiveController($stateParams, pages, rest, config, alerts){
		var ctrl = this;
		var collectionLoading = false;
		var wordsRemoving = false;
		var currentTier = null;
		var activeTiers = null;
		
		ctrl.formSending = false;
		
		ctrl.selectedView = null;
		ctrl.collection = null;
		ctrl.parametersForWords = null;
		ctrl.addCollectionFormData = null;
		
		ctrl.showAllCollections = pages.myLibrary.allCollections;
		ctrl.showPublicLibrary = pages.publicLibrary.main;
		ctrl.isLoading = isLoading;
		ctrl.addWord = pages.word.add;
		ctrl.showCollection = showCollection;
		ctrl.refreshCollection = refreshCollection;
		ctrl.wordsListFilter = wordsListFilter;
		ctrl.listableDataEvents = null;
		
		ctrl.isAnyWordSelected = isAnyWordSelected;
		ctrl.removeSelectedWords = removeSelectedWords;
		ctrl.isRemovingWords = isRemovingWords;
		
		ctrl.clearForm = clearForm;
		ctrl.sendForm = sendForm;
		ctrl.canSave = canSave;
		ctrl.hasChanged = hasChanged;
		
		ctrl.editCollection = editCollection;
		ctrl.openLearning = pages.learning.main;
		
		ctrl.getCurrentTier = getCurrentTier;
		ctrl.getTiersList = getTiersList;
		ctrl.reduceWordsToTier = reduceWordsToTier;
		ctrl.changeCurrentTier = changeCurrentTier;
		ctrl.isTierActive = isTierActive;
		
		init();
		
		//////////////////////
		
		function init(){		
			ctrl.selectedView = ctrl.view != null ? views[ctrl.view] : views[modes.LIST];
			
			if(isAddingCollectionMode()){
				ctrl.addCollectionFormData = initAddCollectionFormData();
			}
			else{
				refreshCollection(true).then(function(data){
					if(isEditingCollectionMode()){
						ctrl.addCollectionFormData = initAddCollectionFormData();
					}
					else{
						ctrl.parametersForWords = initParametersForWords();
						ctrl.listableDataEvents = initListableDataEvents();
						
						if(ctrl.view != modes.PREVIEW){
							initTiersSettings();
						}
					}
				});
			}
		}
		
		function refreshCollection(useCache, forceReload){
			collectionLoading = true;
			return rest.collection.get($stateParams.collectionId, useCache, forceReload).then(function(result){
				if(result.Result){
					ctrl.collection = result.Result;
				}
				
				collectionLoading = false;
			});
		}
		
		function isLoading(){
			return collectionLoading;
		}
		
		function showCollection(){
			pages.myLibrary.collection(ctrl.collection.Id, ctrl.collection.Name);
		}
		
		function isAddingCollectionMode(){
			return ctrl.view == modes.ADD;
		}
		
		function isEditingCollectionMode(){
			return ctrl.view == modes.EDIT;
		}
		
		// ===== Displaying list of words ===== 
		function initTiersSettings(){
			activeTiers = [];
			
			var words = ctrl.collection.Words;
			
			for(var i = 0; i < words.length; i++){
				if(words[i].Tier != null && activeTiers.indexOf(words[i].Tier) < 0){
					activeTiers.push(words[i].Tier);
				}
			}
			
			if(activeTiers.length > 0){
				currentTier = activeTiers[0];
			}
		}
		
		function initParametersForWords(){
			return {
				removeItem: silentlyRemoveItem,
				selectedItems: []
			}
		}
		
		function initListableDataEvents(){
			return {
				onViewChange: function(){ ctrl.parametersForWords.selectedItems = []; }
			}
		}
		
		function silentlyRemoveItem(wordId){
			var words = ctrl.collection.Words;
			
			// Remove collection from local store
			for(var i = 0; i < words.length; i++){
				if(words[i].Id == wordId){
					words.splice(i, 1);
				}
			}
			
			// Refresh promise from cache
			return rest.collection.get($stateParams.collectionId, true, true);
		}
		
		function getCurrentTier(){
			return currentTier;
		}
		
		function getTiersList(){
			return [0,1,2,3,4];
		}
		
		function changeCurrentTier(tier){
			if(isTierActive(tier)){
				currentTier = tier;
			}
		}
		
		function isTierActive(tier){
			return activeTiers.indexOf(tier) >= 0;
		}
		
		function reduceWordsToTier(item){
			var result = false;
			if(item.Tier == getCurrentTier()){
				result = true;
			}
			return result;
		}
		
		function wordsListFilter(item, searchText){
			var text = clearText(searchText);
			var keywords = text.split(" ");
			
			for(var i = 0; i < keywords.length; i++){
				var keyword = keywords[i];
				
				var word = clearText(item.Word);
				if(word.indexOf(keyword) >= 0){
					continue;
				}
				
				var translations = item.Translations;
				var translationFound = false;
				for(var j = 0; j < translations.length; j++){
					var translation = clearText(translations[j].Translation);
					if(translation.indexOf(keyword) >= 0){
						translationFound = true;
						break;
					}
				}
				
				if(translationFound){
					continue;
				}
				
				return false;
			}
			return true;
		}
		
		function clearText(text){
			return text != null ? text.toString().toLowerCase().replace(/\s+/g, " ") : "";
		}
		
		function editCollection(){
			pages.myLibrary.editCollection(ctrl.collection.Id, ctrl.collection.Name);
		}
		
		// ===== Deleting selected =====
		
		function isAnyWordSelected(){
			return ctrl.parametersForWords.selectedItems.length > 0;
		}
		
		function isRemovingWords(){
			return wordsRemoving;
		}
		
		function removeSelectedWords(){
			var items = ctrl.parametersForWords.selectedItems;
			wordsRemoving = true;

			rest.word.remove(items).then(function(result){
				if(result.Result){
					alerts.addGlobalAlert({
						title: 'messages.words.remove.success',
						titleParams: {wordsCount: items.length},
						type: 'success'
					});
					ctrl.parametersForWords.selectedItems.length = 0;
				}
				refreshCollection(true, true);
				wordsRemoving = false;
			});
		}
		
		// ===== Add/edit collection functions =====
		function initAddCollectionFormData(){
			return {
				Name: ctrl.collection != null ? ctrl.collection.Name : null,
				IsPublic: ctrl.collection != null ? ctrl.collection.IsPublic: false,
				Id: ctrl.collection != null ? ctrl.collection.Id : null
			};
		}
		
		function clearForm(form){
			form.$setPristine();
			form.$setUntouched();
			ctrl.addCollectionFormData = initAddCollectionFormData();
		}
		
		function sendForm(form){
			if(isAddingCollectionMode()){
				sendAddCollectionRequest();
			}
			else if(isEditingCollectionMode()){
				sendEditCollectionRequest();
			}
		}
		
		function sendAddCollectionRequest(){
			ctrl.formSending = true;
			
			rest.collection.create([ctrl.addCollectionFormData]).then(function(result){
				if(result.Result){
					var collection = result.Result[0];
					pages.myLibrary.collection(collection.Id, collection.Name);
				}
				ctrl.formSending = false;
			});
		}
		
		function sendEditCollectionRequest(){
			ctrl.formSending = true;
			
			rest.collection.edit([ctrl.addCollectionFormData]).then(function(result){
				if(result.Result){
					var collection = result.Result[0];
					pages.myLibrary.collection(collection.Id, collection.Name);
				}
				ctrl.formSending = false;
			});
		}
		
		function canSave(){
			var result = false;
			if(isFormValid()){
				result = hasChanged();
			}
			return result;
		}
		
		function isFormValid(){
			return ctrl.addCollectionFormData.Name;
		}
		
		function hasChanged(){
			var initialData = initAddCollectionFormData();
			return initialData.Name != ctrl.addCollectionFormData.Name ||
				initialData.IsPublic != ctrl.addCollectionFormData.IsPublic;
		}
	}
}());