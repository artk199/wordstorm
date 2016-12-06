(function () {
	angular.module("wordStormApp.services")
	.service("userPanelService", Service);
	
	Service.$inject = ['rest', 'cookies'];
	function Service(rest, cookies){
		var service = this;
		var checkPersonLoggedPromise = null;
		var personLogged = false;
	
		service.isPersonLogged = isPersonLogged;
		service.checkPersonLogged = checkPersonLogged;
		service.logPersonIn = logPersonIn;
		service.logPersonOut = logPersonOut;
		service.loadPersonData = loadPersonData;
		
		//////////////////////////
		
		function getCheckPersonLoggedPromise(reload){
			if(reload == true || checkPersonLoggedPromise == null){
				checkPersonLoggedPromise = rest.user.isLogged().then(function(data){
					personLogged = data != null? data.Result : false;
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
			return rest.user.login(email, password).then(function(data){
				if(data == null || data.responseError != null){
					personLogged = false;
					return false;
				}
				else{
					var userData = data.Result;
					cookies.credentials.store(userData);
					personLogged = true;
					return true;
				}
			});
		}
		
		function logPersonOut(){
			personLogged = false;
			cookies.credentials.remove();
			return rest.user.logout();
		}
		
		function loadPersonData(){
			return rest.user.profile().then(function(result){
				if(result.Result){
					return result.Result;
				}
				else{
					return null;
				}
			});
		}
	}
}());