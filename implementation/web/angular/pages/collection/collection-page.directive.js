(function () {
	angular.module("wordStormApp.components")
	.directive("collectionPage", Directive);
	
	function Directive(){
		 return {
	    	restrict: 'E',
	    	templateUrl: 'angular/pages/collection/collection-page.directive.html',
	    	controller: DirectiveController,
	    	controllerAs: 'ctrl',
	    	bindToController: true,
	    	scope: {}
	    };
	}
	
	DirectiveController.$inject = ['$stateParams', 'pages', 'rest'];
	function DirectiveController($stateParams, pages, rest){
		var ctrl = this;
		var collectionLoading = false;
		
		ctrl.collection = null;
		ctrl.showAllCollections = pages.myLibrary.allCollections;
		ctrl.isLoading = isLoading;
		
		init();
		
		//////////////////////
		
		function init(){
			ctrl.collection = createSimpleCollectionObject();
			refreshCollection(true);
		}
		
		function refreshCollection(useCache){
			collectionLoading = true;
			rest.collection.get($stateParams.groupId, useCache).then(function(result){
				if(result.Result){
					ctrl.collection = result.Result;
				}
				
				collectionLoading = false;
			});
		}
		
		function createSimpleCollectionObject(){
			return {
				Name: $stateParams.groupName
			};
		}
		
		function isLoading(){
			return collectionLoading;
		}
		
	}
}());