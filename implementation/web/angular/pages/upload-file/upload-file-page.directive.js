(function () {
	angular.module("wordStormApp.pages")
	.directive("uploadFilePage", Directive)
	.directive("uploadFileModel", DirectiveModel);
	
	function Directive(){
		 return {
	    	restrict: 'E',
	    	templateUrl: 'angular/pages/upload-file/upload-file-page.directive.html',
	    	controller: DirectiveController,
	    	controllerAs: 'ctrl',
	    	bindToController: true,
	    	scope: {}
	    };
	}
	
	DirectiveModel.$inject = ["$parse"];
	function DirectiveModel($parse){
	     return {
           restrict: 'A',
           scope:{
        	   changeFunction: '='
           },
           link: function(scope, element, attrs) {
    		  element.bind('change', function(){
    			  scope.changeFunction(element[0].files[0]);
              });
           }
        };
	}
	
	var views = {
		INPUT: "angular/pages/upload-file/views/upload-file-input-view.html",
		CHOOSE: "angular/pages/upload-file/views/upload-file-choose-view.html"
	};
	
	var loadingData = {
		SENDING: false,
		CREATING: false
	};
	
	DirectiveController.$inject = ['rest', 'alerts', "config", "$scope", "pages", "$timeout"];
	function DirectiveController(rest, alerts, config, $scope, pages, $timeout){
		var ctrl = this;
		
		ctrl.manualInputSelected = false;
		ctrl.errors = null;
		ctrl.view = null;
		ctrl.wordsList = null;
		ctrl.collection = null;
		
		ctrl.uploadFile = uploadFile;
		ctrl.sendManualInput = sendManualInput;
		ctrl.getAllowedFileExtensions = getAllowedFileExtensions;
		ctrl.getAllowedMaxSize = getAllowedMaxSize;
		ctrl.hasError = hasError;
		ctrl.isDataSending = isDataSending;
		ctrl.showAllCollections = pages.myLibrary.allCollections;
		
		ctrl.isCollectionCreating = isCollectionCreating;
		ctrl.createCollection = createCollection;
		ctrl.cancelCreation = cancelCreation;
		
		init();
		
		////////////////
		
		function init(){
			ctrl.errors = initErrors();
			ctrl.view = views.INPUT;
			initLoadingData();
		}
		
		function initErrors(){
			return {
				FileExtensionInvalid: false,
				FileSizeTooLarge: false
			};
		}
		
		function initLoadingData(){
			loadingData.SENDING = false;
		}
		
		function uploadFile(file){
			if(validateFile(file)){
				loadingData.SENDING = true;
				
				$timeout(function(){
					loadingData.SENDING = false;
					ctrl.view = views.CHOOSE;
				}, 2000);
			}
			$scope.$apply();
		}
		
		function sendManualInput(text){
			loadingData.SENDING = true;
			
			rest.upload.text(text).then(function(data){	
				if(data.Result){
					ctrl.wordsList = data.Result;
				}
				
				loadingData.SENDING = false;
				ctrl.view = views.CHOOSE;
			});
		}
		
		function validateFile(file){
			ctrl.errors = initErrors();
			return file != null && validateExtension(file.name) && validateFileSize(file.size);
		}
		
		function validateFileSize(fileSize){
			var maxAllowed = config.uploadFileMaxSizeInMb;
			var size = fileSize * 1024 * 1024;
			
			if(size <= maxAllowed){
				return true;
			}
			ctrl.errors.FileSizeTooLarge = true;
			return false;
		}
		
		function validateExtension(fileName){
			if(fileName){
				var allowedExtensions = config.uploadFileExtensions;
				var extension = fileName.split(".").pop();
				
				for(var i = 0; i < allowedExtensions.length; i++){
					if(extension == allowedExtensions[i]){
						return true;
					}
				}
			}
			
			ctrl.errors.FileExtensionInvalid = true;
			return false;
		}
		
		function getAllowedFileExtensions(){
			return config.uploadFileExtensions.join(", ");
		}
		
		function getAllowedMaxSize(){
			return config.uploadFileMaxSizeInMb;
		}
		
		function hasError(){
			return ctrl.errors.FileExtensionInvalid;
		}
		
		function isDataSending(){
			return loadingData.SENDING;
		}
		
		// Creating collection
		
		function isCollectionCreating(){
			return loadingData.CREATING;
		}
		
		function createCollection(){
			loadingData.CREATING = true;
			
			// First, create collection
			rest.collection.create([ctrl.collection]).then(function(data){
				if(data.Result){
					var collection = data.Result[0];
					
					// After collection is created, create words for it
					rest.word.create(collection.Id, ctrl.wordsList).then(function(result){
						if(result.Result){
							pages.myLibrary.collection(collection.Id, collection.Name);
						}
						loadingData.CREATING = false;
					});
				}
			});
		}
		
		function cancelCreation(){
			init();
		}
	}
}());