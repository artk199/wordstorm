(function () {
	angular.module("wordStormApp.services")
	.service("restMock", Service);
	
	Service.$inject = ['$timeout', '$q', 'cookies'];
	function Service($timeout, $q, cookies){
		var service = this;
		
		service.isPersonLogged = isPersonLogged;
		service.logout = logPersonOut;
		
		//////////////////////////
		
		function isPersonLogged(){
			var header = cookies.credentials.createHeader();
			return $timeout(function(){return header.length > 0}, 1000);
		}
	
		function logPersonOut(email){
			return $q.when();
		}
	}
}());