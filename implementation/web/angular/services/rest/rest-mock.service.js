(function () {
	angular.module("wordStormApp.services")
	.service("restMock", Service);
	
	Service.$inject = ['$timeout', '$q', 'cookies'];
	function Service($timeout, $q, cookies){
		var service = this;
		
		service.isPersonLogged = isPersonLogged;
		service.logout = logPersonOut;
		service.sendContactUs = sendContactUs;
		
		//////////////////////////
		
		function isPersonLogged(){
			var header = cookies.credentials.createHeader();
			return $timeout(function(){return header.length > 0}, 1000);
		}
	
		function logPersonOut(email){
			return $q.when();
		}
		
		function sendContactUs(){
			return $timeout(function(){return true}, 1000);
		}
	}
}());