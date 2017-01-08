(function () {
	angular.module("wordStormApp.pages")
	.directive("wordPage", Directive);
	
	function Directive(){
		 return {
	    	restrict: 'E',
	    	templateUrl: 'angular/pages/word/word-page.directive.html',
	    	controller: DirectiveController,
	    	controllerAs: 'ctrl',
	    	bindToController: true,
	    	scope: {
	    		view: '@'
	    	}
	    };
	}
	
	var views = {
		EDIT: "edit",
		ADD: "add",
		VIEW: "view"
	};
	
	var loadingData = {
		WORD: false,
		SENDING_FORM: false
	};
	
	var subpages = {
		"edit" : "angular/pages/word/views/word-page-form-view.html",
		"add" : "angular/pages/word/views/word-page-form-view.html"
	};
	
	var TRANSLATE_PREFIX = "enums.partOfSpeech.";
	
	DirectiveController.$inject = ['$stateParams', 'pages', 'rest'];
	function DirectiveController($stateParams, pages, rest){
		var ctrl = this;
		
		ctrl.word = null;
		ctrl.formData = null;
		ctrl.selectedView = null;
		
		ctrl.isLoading = isLoading;
		ctrl.showAllCollections = pages.myLibrary.allCollections;
		ctrl.showCollection = showCollection;
		ctrl.getSimpleCollection = getSimpleCollection;
		
		ctrl.addEmptyTranslation = addEmptyTranslation;
		ctrl.canSaveForm = canSaveForm;
		ctrl.clearForm = clearForm;
		ctrl.sendForm = sendForm;
		ctrl.isFormSending = isFormSending;
	
		init();
		
		////////////////////////////
		
		function init(){
			var wordId = $stateParams.wordId;
			ctrl.selectedView = ctrl.view != null ? subpages[ctrl.view] : subpages[views.FORM];
			
			if(wordId != null){
				refreshWord(wordId).then(function(){
					if(isEditMode()){
						initFormView();
					}
				});
			}
			else if(isAddingMode()){
				initFormView();
				addEmptyTranslation();
			}
		}
		
		function showCollection(){
			var collection = getSimpleCollection();
			pages.myLibrary.collection(collection.Id, collection.Name);
		}
		
		function getSimpleCollection(){
			return {
				Id: ctrl.word != null ? ctrl.word.Collection.Id : $stateParams.collectionId,
				Name: ctrl.word != null ? ctrl.word.Collection.Name : $stateParams.collectionName
			};
		}
		
		function refreshWord(wordId, useCache, forceReload){
			loadingData.WORD = true;
			return rest.word.get(wordId).then(function(result){
				if(result.Result != null){
					ctrl.word = result.Result;
					loadingData.WORD = false;
				}
			});
		}
		
		function isLoading(){
			return loadingData.WORD;
		}
		
		// ===== Form view =====
		
		function isEditMode(){
			return ctrl.view == views.EDIT;
		}
		
		function isAddingMode(){
			return ctrl.view == views.ADD;
		}
		
		function isFormSending(){
			return loadingData.SENDING_FORM;
		}
		
		function initFormView(){
			ctrl.formData = initFormData();
		}
		
		function initFormData(){	
			return ctrl.word != null ? angular.copy(ctrl.word) : {
				Word: null,
				Pronunciation: null,
				Translations: [],
				PartOfSpeech: null
			};
		}
		
		function hasFormChanged(initialFormData){
			if(ctrl.formData != null){
				var currentForm = ctrl.formData;
				return initialFormData.Word != currentForm.Word 
					|| initialFormData.Pronunciation != currentForm.Pronunciation
					|| initialFormData.PartOfSpeech != currentForm.PartOfSpeech;
			}
			return false;
		}
		
		function hasTranslationsChanged(initialFormData){
			var result = false;
			if(ctrl.formData != null){
				var translations = ctrl.formData.Translations;
				var initialTranslations = initialFormData.Translations;
				
				// If size of both lists differ, user provided changes
				if(initialTranslations.length != translations.length){
					result = true;
				}
				// Check all translations and find at least one changed
				else{
					for(var i = 0; i < translations.length; i++){
						if(translations[i].Translation != initialTranslations[i].Translation
								|| translations[i].PartOfSpeech != initialTranslations[i].PartOfSpeech){
							result = true;
							break;
						}
					}
				}
			}
			return result;
		}
		
		function isFormValid(){
			var result = false;
			// Check if fields are not empty
			if(ctrl.formData != null && ctrl.formData.Word != null){
				result = true;
				
				var currentForm = ctrl.formData;
				var isAnyTranslation = currentForm.Translations && currentForm.Translations.length > 0;
				
				// Check if all translations are provided properly
				if(isAnyTranslation){
					var translations = currentForm.Translations;
					for(var i = 0; i < translations.length; i++){
						if(!translations[i].Translation || !translations[i].PartOfSpeech){
							result = false;
							break;
						}
					}
				}	
			}
			return result;
		}
		
		function clearParthOfSpeech(partOfSpeech){
			return partOfSpeech.slice(TRANSLATE_PREFIX.length);
		}
		
		function canSaveForm(){
			var initialFormData = initFormData();
			var result = false;
			if(isFormValid()){
				result = hasFormChanged(initialFormData) || hasTranslationsChanged(initialFormData);
			}
			return result;
		}
		
		function clearForm(form){
			form.$setPristine();
			form.$setUntouched();
			ctrl.formData = initFormData();
		}
		
		function sendForm(form){
			// TODO: Refactor this
			for(var i = 0; i < ctrl.formData.Translations.length; i++){
				var translation = ctrl.formData.Translations[i];
				translation.PartOfSpeech = clearParthOfSpeech(translation.PartOfSpeech);
			}
			if(isAddingMode()){
				createWord();
			}
			else if(isEditMode()){
				editWord();
			}
		}
		
		function addEmptyTranslation(){
			ctrl.formData.Translations.push(createEmptyTranslation());
		}
		
		function createEmptyTranslation(){
			return {
				Translation: null
			};
		}
		
		function createWord(){
			var collection = getSimpleCollection();
			
			loadingData.SENDING_FORM = true;
			rest.word.create(collection.Id, [ctrl.formData]).then(function(result){
				if(result.Result != null){
					pages.myLibrary.collection(collection.Id, collection.Name);
				}
				loadingData.SENDING_FORM = false;
			});
		}
		
		function editWord(){
			loadingData.SENDING_FORM = true;
			
			rest.word.edit([ctrl.formData]).then(function(result){
				if(result.Result != null){
					pages.myLibrary.allCollections();
				}
				loadingData.SENDING_FORM = false;
			});
		}
	}
}());