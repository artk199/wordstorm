(function () {
	angular.module("wordStormApp")
	.config(StateConfiguration)
	.run(StateRun);
	
	// Adding states here
	StateConfiguration.$inject = ['$stateProvider'];
	function StateConfiguration($stateProvider){
		addState("wordStorm", "home", "<main-page></main-page>");
		addState("state1", "state1", "<example-page></example-page>");
		addState("state2", "state2", "<example-page2></example-page2>");
		addState("register", "register", "<register-page></register-page>");
		addState("error", "error", "<error-page></error-page>", {error: null});
		
		///////////////////////////
		
		function addState(stateName, url, template, params){
			$stateProvider.state(
				stateName, 
				{
					url: url, 
					template: template,
					params: params || {}
				}
			);
		}
	}
	
	// Configure application behaviour on entering with different pages
	StateRun.$inject = ['$location', 'pages'];
	function StateRun($location, pages){
		var currentPath = $location.path();
		
		switch(currentPath){
			case '/home':
				pages.home();
			break;
			case '/state1':
				pages.examplePage();
			break;
			case '/state2':
				pages.examplePage2();
			break;
			case '/register':
				pages.register();
			break;
			case '/error':
				pages.error();
			break;
			default:
				pages.home();
		}
	}
}());