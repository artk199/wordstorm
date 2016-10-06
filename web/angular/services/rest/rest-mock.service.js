(function () {
	angular.module("wordStormApp.services")
	.service("restMock", Service);
	
	Service.$inject = ['$timeout', '$q'];
	function Service($timeout, $q){
		var service = this;
		
		service.isPersonLogged = isPersonLogged;
		service.logPersonIn = logPersonIn;
		service.logPersonOut = logPersonOut;
		
		//////////////////////////
		
		function isPersonLogged(){
			return $timeout(function(){return false}, 1500);
		}
		
		function logPersonIn(email, password){
			return $timeout(function(){
				if(email != "deem2@op.pl"){
					return true;
				}
				return false;
			}, 1500)
		}
		
		function logPersonOut(email){
			return $q.when();
		}
	}
}());