(function () {
	angular.module("wordStormApp.services")
	.service("cookies", Service);
	
	Service.$inject = ['$cookies'];
	
	var cookies = {
		CREDENTIALS: "credentials",
		SETTINGS: "settings"
	};
	
	function Service($cookies){
		var service = this;
		var simpleCookieCache = {};
		
		service.credentials = {
			store: storeCredentials,
			createHeader: createCredentialsHeader,
			remove: removeCredentials
		};
		
		service.settings = {
			store: storeSetting,
			get: getSetting
		};
		
		/////////////////////////
		
		// Credentials functions
		function storeCredentials(credentials){
			$cookies.putObject(cookies.CREDENTIALS, credentials);
		}
		
		function createCredentialsHeader(){
			var result = "";
			var cookie = $cookies.getObject(cookies.CREDENTIALS);
			if(cookie != null){
				result = cookie.token_type + " " + cookie.access_token;
			}
			return result;
		}
		
		function removeCredentials(){
			$cookies.remove(cookies.CREDENTIALS);
		}
		
		// Settings functions
		function getSetting(settingName){
			var result = simpleCookieCache[cookies.SETTINGS];
			if(!result){
				result = $cookies.getObject(cookies.SETTINGS);
				simpleCookieCache[cookies.SETTINGS] = result;
			}
			
			return result ? result[settingName] : null;
		}
		
		function storeSetting(settingName, settingValue){
			var cookie = $cookies.getObject(cookies.SETTINGS) || {};
			cookie[settingName] = settingValue;
			simpleCookieCache[cookies.SETTINGS] = cookie;
			$cookies.putObject(cookies.SETTINGS, cookie);
		}
	}
}());