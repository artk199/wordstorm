(function () {
	angular.module("wordStormApp")
	.config(StateConfiguration);
	
	// Adding states here
	StateConfiguration.$inject = ['$stateProvider', '$urlRouterProvider'];
	function StateConfiguration($stateProvider, $urlRouterProvider){
		$urlRouterProvider.otherwise('/home');	
		
		addState("home", "/home", "<main-page></main-page>");
		addState("register", "/register", "<register-page></register-page>", {title: 'register.pageTitle'});
		addState("error", "/error", "<error-page></error-page>", {
			title: "error.page.pageTitle",
			error: null
		});
		addState("myLibrary", "/my-library", "<my-library-page></my-library-page>", {title: "myLibrary.pageTitle"});
		addState("publicLibrary", "/public-library", "<public-library-page></public-library-page>", {title: "publicLibrary.pageTitle"});

		addState("collection", "/collection/{collectionName}/{collectionId}", "<collection-page></collection-page>", {
			title: "myLibrary.collection.show.pageTitle",
			collectionId: null,
			collectionName: null
		});
		addState("collectionPreview", "/collection/preview/{collectionName}/{collectionId}", "<collection-page view='preview'></collection-page>", {
			title: "publicLibrary.collection.preview.pageTitle",
			collectionId: null,
			collectionName: null
		});
		addState("addCollection", "/collection/add", "<collection-page view='add'></collection-page>", {title: "myLibrary.collection.add.pageTitle"});
		addState("editCollection", "/collection/edit/{collectionName}/{collectionId}", "<collection-page view='edit'></collection-page>", {
			title: "myLibrary.collection.edit.pageTitle",
			collectionId: null,
			collectionName: null
		});
		addState("authError", "/authorization-error", "<authorization-error-page></authorization-error-page>", {title: "authError.pageTitle"});	
		addState("word", "/word/{word}/{wordId}", "<word-page></word-page>", {
			title: "myLibrary.word.show.pageTitle",
			word: null,
			wordId: null
		});
		addState("addWord", "/word/add/{collectionName}/{collectionId}", "<word-page view='add'></word-page>", {
			title: "myLibrary.word.add.pageTitle",
			collectionId: null,
			collectionName: null
		});
		addState("editWord", "/word/edit/{word}/{wordId}", "<word-page view='edit'></word-page>", {
			title: "myLibrary.word.edit.pageTitle",
			word: null,
			wordId: null
		});
		addState("learning", "/learning/{collectionName}/{collectionId}/{tier}", "<learning-page></learning-page>", {
			title: "myLibrary.learning.pageTitle",
			collectionName: null,
			collectionId: null,
			tier: null
		});
		addState("uploadFile", "/upload-file", "<upload-file-page></upload-file-page>", {title: "uploadFile.pageTitle"});
		addState("contactUs", "/contact-us", "<contact-us-page></contact-us-page>", {title: "contactUs.pageTitle"});
		
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