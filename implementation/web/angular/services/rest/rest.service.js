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
			logout: logoutUser,
			profile: loadUserData
		};
		
		service.collection = {
			getAll: getAllCollections,
			create: createCollection,
			get: getCollection,
			remove: removeCollection,
			removeList: removeListOfCollections,
			edit: editCollection,
			getPublic: getPublicCollections
		};
		
		service.word = {
			create: createWord,
			remove: removeWord,
			get: getWord,
			edit: editWord,
			isKnown: isWordKnown
		};
		
		service.common = {
			partOfSpeech: getPartOfSpeechEnum
		};
		
		service.upload = {
			text: uploadText
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
		
		function loadUserData(){
			return restCache.get("userCache", "User/Profile", null, null, true);
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
		
		function getPublicCollections(pageSize, pageNumber, useCache, forceReload){
			return restCache.get("publicCollections", "Collection/Public", null, null, useCache, forceReload);
		}
		
		// Words functions
		
		function createWord(collectionId, data){
			restCache.clearCache("wordsCache");
			restCache.clearCache("collectionsCache");
			return restConfig.createPostPromise("Word/" + collectionId, data);
		}
		
		function removeWord(wordsId){
			restCache.clearCache("wordsCache");
			restCache.clearCache("collectionsCache");
			return restConfig.createDeletePromise("Word", wordsId);
		}
		
		function getWord(wordId, useCache, forceReload){
			return restCache.get("wordsCache", "Word/" + wordId, null, null, useCache, forceReload);
		}
		
		function editWord(words){
			restCache.clearCache("wordsCache");
			restCache.clearCache("collectionsCache");
			return restConfig.createPutPromise("Word", words);
		}
		
		function isWordKnown(wordId, isKnown){
			restCache.clearCache("wordsCache");
			restCache.clearCache("collectionsCache");
			return restConfig.createPostPromise("Word/Tier", [{Id: wordId, IsKnown: isKnown}]);
		}
		
		// Common functions 
		function getPartOfSpeechEnum(){
			return restCache.get("commonCache", "Common/PartOfSpeech", null, null, true);
		}
		
		// File upload functions
		function uploadText(text){
			var params = { headers : {'Content-Type' : 'text/plain'}};
			return restConfig.createPostPromise("File/Text", text, params, false, true);
		}
	}
}());