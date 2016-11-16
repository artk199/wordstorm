(function () {
	angular.module("wordStormApp.services")
	.service("userPanelService", Service);
	
	Service.$inject = ['rest', 'cookies'];
	function Service(rest, cookies){
		var service = this;
		var loggedPersonData = null;
		var checkPersonLoggedPromise = null;
		var personLogged = false;
	
		service.isPersonLogged = isPersonLogged;
		service.checkPersonLogged = checkPersonLogged;
		service.logPersonIn = logPersonIn;
		service.logPersonOut = logPersonOut;
	
		
		//////////////////////////
		function getCheckPersonLoggedPromise(reload){
			if(reload == true || checkPersonLoggedPromise == null){
				checkPersonLoggedPromise = rest.user.isLogged().then(function(data){
					personLogged = data;
				});
			}
			return checkPersonLoggedPromise;
		}
		
		function checkPersonLogged(reload){
			return getCheckPersonLoggedPromise(reload);
		}
		
		function isPersonLogged(){
			return personLogged;
		}
		
		function logPersonIn(email, password){
			loggedPersonData = {};
			
			return rest.user.login(email, password).then(function(data){
				if(data == null || data.responseError != null){
					handleErrorOnLoggin(data != null ? data.responseError : null);
					return false;
				}
				else{
					var userData = data.Result;
					cookies.credentials.store(userData);
					loggedPersonData.email = email;
					personLogged = userData;
					return true;
				}
			});
		}
		
		function handleErrorOnLoggin(){
			
		}
		
		function logPersonOut(){
			personLogged = false;
			cookies.credentials.remove();
			return rest.user.logout();
		}
	}
}());