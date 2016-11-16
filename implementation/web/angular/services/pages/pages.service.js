(function () {
	angular.module("wordStormApp.services")
	.service("pages", Service);
	
	Service.$inject = ['$state', 'restCache'];
	function Service($state, restCache){
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
				$state.go("my-library");
			},
			collection : function(groupId, groupName, collectionObj){
				$state.go("collection", {
					groupId: groupId,
					groupName: paresUrlParameter(groupName),
					collectionObj: collectionObj
				});
			}
		};
		
		service.isPageOpened = function(stateName){
			return $state.is(stateName);
		};
		
		function paresUrlParameter(parameter){
			var result = null;
			if(parameter){
				result = parameter.toString().toLowerCase().replace(/\s+/g, "-");
			}
			return result;
		}
	}
}());