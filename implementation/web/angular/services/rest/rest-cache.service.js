(function () {
	angular.module("wordStormApp.services")
	.service("restCache", Service);
	
	Service.$inject = ['restConfig'];
	function Service(restConfig){
		var service = this;
		var caches = {};
		
		service.clearCache = clearCache;
		service.clearAllCaches = clearAllCaches;
		service.get = handleCache;
		
		//////////
		
		function handleCache(cacheName, url, parameters, skipDefaultParameters, useCache, forceReload){
			var result = null;
			
			// Try to use promise from cache - if not found, return normal promise and store it in cache
			if(useCache){
				result = getFromCache(cacheName, url);
				
				if(result == null || forceReload){
					var newPromise = restConfig.createGetPromise(url, parameters, skipDefaultParameters);
					storeInCache(cacheName, url, newPromise);
					result = newPromise;
				}
			}
			// Return simple GET promise if user do not want to use cache
			else{
				result = restConfig.createGetPromise(url, parameters, skipDefaultParameters);
			}
			return result;
		}
		
		function getFromCache(cacheName, url){
			var cache = getOrCreateCache(cacheName);
			return cache[url];
		}
		
		function storeInCache(cacheName, url, promise){
			var cache = getOrCreateCache(cacheName);
			cache[url] = promise;
		}
		
		function clearCache(cacheName){
			caches[cacheName] = null;
		}
		
		function clearAllCaches(){
			caches = {};
		}
		
		function getOrCreateCache(cacheName){
			caches[cacheName] = caches[cacheName] || {};
			return caches[cacheName];
		}
	}
}());