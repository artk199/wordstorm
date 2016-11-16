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
		addState("myLibrary", "/my-library", "<my-library-page></my-library-page>");
		addState("publicLibrary", "/public-library", "<public-library-page></public-library-page>");

		addState("collection", "/collection/{collectionName}/{collectionId}", "<collection-page></collection-page>", {
			collectionId: null,
			collectionName: null
		});
		addState("addCollection", "/collection/add", "<collection-page view='add'></collection-page>");
		addState("editCollection", "/collection/edit/{collectionName}/{collectionId}", "<collection-page view='edit'></collection-page>", {
			collectionId: null,
			collectionName: null
		});
		addState("authError", "/authorization-error", "<authorization-error-page></authorization-error-page>");	
		addState("word", "/word/{word}/{wordId}", "<word-page></word-page>", {
			word: null,
			wordId: null
		});
		addState("addWord", "/word/add/{collectionName}/{collectionId}", "<word-page view='add'></word-page>", {
			collectionId: null,
			collectionName: null
		});
		addState("editWord", "/word/edit/{word}/{wordId}", "<word-page view='edit'></word-page>", {
			word: null,
			wordId: null
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