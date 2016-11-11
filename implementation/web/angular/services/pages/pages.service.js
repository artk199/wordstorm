(function () {
	angular.module("wordStormApp.services")
	.service("pages", Service);
	
	Service.$inject = ['$state'];
	function Service($state){
		var service = this;
		
		service.home = function(params){
			$state.go("home", params);
		};
		
		service.register = function(params){
			$state.go("register", params);
		};
		
		service.error = function(error){
			$state.go("error", {
				error: error
			});
		};
		
		service.myLibrary = {
			allCollections : function(){
				$state.go("my-library");
			},
			collection : function(groupId, groupName, collectionObj){
				$state.go("collection", {
					groupId: groupId,
					groupName: groupName,
					collectionObj: collectionObj
				});
			}
		};
		
		service.isPageOpened = function(stateName){
			return $state.is(stateName);
		};
	}
}());