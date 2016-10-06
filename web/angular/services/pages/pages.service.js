(function () {
	angular.module("wordStormApp.services")
	.service("pages", Service);
	
	Service.$inject = ['$state'];
	function Service($state){
		var service = this;
		
		service.home = function(){
			$state.go("wordStorm");
		};
		
		service.examplePage = function(){
			$state.go("state1");
		};
		
		service.examplePage2 = function(){
			$state.go("state2");
		};
		
		service.register = function(){
			$state.go("register");
		};
		
		service.error = function(error){
			$state.go("error", error);
		};
		
		service.isPageOpened = function(stateName){
			return $state.is(stateName);
		};
	}
}());