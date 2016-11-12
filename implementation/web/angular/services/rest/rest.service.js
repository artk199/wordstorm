(function () {
	angular.module("wordStormApp.services")
	.service("rest", Service);
	
	Service.$inject = ['restCache', 'restConfig', 'restMock'];
	function Service(restCache, restConfig, restMock){
		var service = this;
		
		service.register = {
			create: createUser
		};
		
		service.user = {
			login: loginUser,
			isLogged: isUserLogged,
			logout: logoutUser
		};
		
		service.collection = {
			getAll: getAllCollections,
			create: createCollection,
			get: getCollection,
			remove: removeCollection,
			removeList: removeListOfCollections,
			edit: editCollection
		};
		
		//////////////////////////////
		
		// Register user functions
		function createUser(userData){
			return restConfig.createPostPromise("Register", userData);
		}
		
		// Current user functions
		function loginUser(email, password){
			return restConfig.createPostPromise("Login", {Email: email, Password: password}, null, true);
		}
		
		function logoutUser(){
			restCache.clearAllCaches();
			return restMock.logout();
		}
		
		function isUserLogged(){
			return restConfig.createGetPromise("User/Token");
		}
		
		// Current user collection functions
		
		function getAllCollections(pageSize, pageNumber, useCache, forceReload){
			return restCache.get("collectionsCache", "Collection", null, null, useCache, forceReload);
		}
		
		function createCollection(collectionData){
			restCache.clearCache("collectionsCache");
			return restConfig.createPostPromise("Collection", collectionData);
		}
		
		function getCollection(collectionId, useCache, forceReload){
			return restCache.get("collectionsCache", "Collection/" + collectionId, null, null, useCache, forceReload);
		}
		
		function removeCollection(collectionId){
			restCache.clearCache("collectionsCache");
			return restConfig.createDeletePromise("Collection/Delete/" + collectionId);
		}
		
		function removeListOfCollections(collectionsList){
			restCache.clearCache("collectionsCache");
			return restConfig.createDeletePromise("Collection/Delete", collectionsList);
		}
		
		function editCollection(collectionData){
			restCache.clearCache("collectionsCache");
			return restConfig.createPutPromise("Collection", collectionData);
		}
	}
}());