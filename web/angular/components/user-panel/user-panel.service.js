(function () {
	angular.module("wordStormApp.services")
	.service("userPanelService", Service);
	
	Service.$inject = ['rest'];
	function Service(rest){
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
				checkPersonLoggedPromise = rest.person.isPersonLogged().then(function(data){
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
			return rest.person.logPersonIn(email, password).then(function(data){
				loggedPersonData.email = email;
				personLogged = data;
				
				return data;
			});
		}
		
		function logPersonOut(){
			personLogged = false;
			return rest.person.logPersonOut(loggedPersonData.email);
		}
	}
}());