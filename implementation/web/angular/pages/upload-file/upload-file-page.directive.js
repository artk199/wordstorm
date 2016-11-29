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
		INPUT: "angular/pages/upload-file/views/upload-file-input-view.html"
	};
	
	var loadingData = {
		SENDING: false	
	};
	
	DirectiveController.$inject = ['rest', 'alerts', "config", "$scope", "pages"];
	function DirectiveController(rest, alerts, config, $scope, pages){
		var ctrl = this;
		
		ctrl.manualInputSelected = false;
		ctrl.errors = null;
		ctrl.view = null;
		
		ctrl.uploadFile = uploadFile;
		ctrl.sendManualInput = sendManualInput;
		ctrl.getAllowedFileExtensions = getAllowedFileExtensions;
		ctrl.getAllowedMaxSize = getAllowedMaxSize;
		ctrl.hasError = hasError;
		ctrl.isDataSending = isDataSending;
		ctrl.showAllCollections = pages.myLibrary.allCollections;
		
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
			}
			$scope.$apply();
		}
		
		function sendManualInput(text){
			loadingData.SENDING = true;
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
	}
}());