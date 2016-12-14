(function () {
	angular.module("wordStormApp.services")
	.service("pages", Service);
	
	Service.$inject = ['$state', 'restCache', '$translate'];
	function Service($state, restCache, $translate){
		var service = this;
		
		service.home = function(params){
			$state.go("home", params);
		};
		
		service.register = function(params){
			$state.go("register", params);
		};
		
		service.error = function(error){
			restCache.clearAllCaches();
			$state.go("error", {
				error: error
			});
		};
		
		service.authError = function(params){
			restCache.clearAllCaches();
			$state.go("authError", params);
		};
		
		service.myLibrary = {
			allCollections : function(){
				$state.go("myLibrary");
			},
			collection : function(collectionId, collectionName){
				$state.go("collection", {
					collectionId: collectionId,
					collectionName: parseUrlParameter(collectionName)
				});
			},
			collectionPreview : function(collectionId, collectionName){
				$state.go("collectionPreview", {
					collectionId: collectionId,
					collectionName: parseUrlParameter(collectionName)
				});
			},
			addCollection: function(){
				$state.go("addCollection");
			},
			editCollection : function(collectionId, collectionName){
				$state.go("editCollection", {
					collectionId: collectionId,
					collectionName: parseUrlParameter(collectionName)
				});
			},
		};
		
		service.publicLibrary = {
			main: function(){	
				$state.go("publicLibrary");
			}
		};
		
		service.word = {
			show: function(wordId, word){
				$state.go("word", {word: word, wordId: wordId});
			},
			add: function(collectionId, collectionName){
				$state.go("addWord", {
					collectionId: collectionId, 
					collectionName: parseUrlParameter(collectionName)
				});
			},
			edit: function(wordId, word){
				$state.go("editWord", {
					word: parseUrlParameter(word), 
					wordId: wordId
				});
			}
		};
		
		service.learning = {
			main: function(collectionId, collectionName, tier){
				$state.go("learning", {
					collectionId: collectionId,
					collectionName: parseUrlParameter(collectionName),
					tier: tier
				});
			}
		};
		
		service.uploadFile = function(){
			$state.go("uploadFile");
		};
		
		service.contactUs = function(){
			$state.go("contactUs");
		};
		
		service.isPageOpened = function(stateName){
			return $state.is(stateName);
		};
		
		service.getCurrentPagetitle = function(){
			var title = $state.params.title;
			var result = $translate.instant("application.title");
			
			if(title){
				result = $translate.instant(title) + " - " + result;
			}
			return result;
		};
		
		////////////////////
		
		function parseUrlParameter(parameter){
			var result = null;
			if(parameter){
				result = parameter.toString().toLowerCase().replace(/\s+/g, "-");
			}
			return result;
		}
	}
}());