(function () {
	angular.module("wordStormApp.services")
	.service("cookies", Service);
	
	Service.$inject = ['$cookies'];
	
	var cookies = {
		CREDENTIALS: "credentials"
	};
	
	function Service($cookies){
		var service = this;
		
		service.credentials = {
				store: storeCredentials,
				createHeader: createCredentialsHeader,
				remove: removeCredentials
		};
		
		/////////////////////////
		
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
	}
}());