(function () {
	angular.module("wordStormApp")
	.config(StateConfiguration);
	
	// Adding states here
	StateConfiguration.$inject = ['$stateProvider', '$urlRouterProvider'];
	function StateConfiguration($stateProvider, $urlRouterProvider){
		$urlRouterProvider.otherwise('/home');	
		
		addState("home", "/home", "<main-page></main-page>");
		addState("register", "/register", "<register-page></register-page>");
		addState("error", "/error", "<error-page></error-page>", {
			error: null
		});
		addState("my-library", "/my-library", "<my-library-page></my-library-page>");
		addState("collection", "/collection/{groupName}/{groupId}", "<collection-page></collection-page>", {
			groupId: null,
			groupName: null,
			collectionObj: null
		});
		
		///////////////////////////
		
		function addState(stateName, url, template, params){
			$stateProvider.state(stateName, {
					url: url, 
					template: template,
					params: params || {}
				}
			);
		}
	}
}());