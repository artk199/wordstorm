(function () {
	angular.module("wordStormApp.components")
	.directive("navbar", Directive);
	
	function Directive(){
		 return {
	    	restrict: 'E',
	    	templateUrl: 'angular/components/navbar/navbar.directive.html',
	    	controller: DirectiveController,
	    	controllerAs: 'ctrl',
	    	bindToController: true,
	    	scope: {}
	    };
	}
	
	DirectiveController.$inject = ['config', 'pages', 'userPanelService'];
	function DirectiveController(config, pages, userPanelService){
		var ctrl = this;
		var isPersonLoggedLoading = false;
		var isUserDataLoading = false;
		
		ctrl.displayDevMode = config.devMode == true;
		ctrl.displaySearchBar = config.searchUrl != null;
		ctrl.userData = null;
		
		ctrl.openHomePage = pages.home;
		ctrl.openPublicLibrary = pages.publicLibrary.main;
		ctrl.openMyLibrary = pages.myLibrary.allCollections;
		ctrl.openUploadFile = pages.uploadFile;
		ctrl.openContactUs = pages.contactUs;
			
		ctrl.logout = logout;
		
		ctrl.isPersonLogged = userPanelService.isPersonLogged;
		ctrl.getLoggedUserName = userPanelService.loadPersonData;
		ctrl.isLoading = isLoading;
		ctrl.isMyLibraryOpened = isMyLibraryOpened;
		ctrl.isPublicLibraryOpened = isPublicLibraryOpened;
		
		ctrl.getDownloadAndroidApkLink = getDownloadAndroidApkLink;
		
		init();
		
		////////////////
		function init(){
			refreshIsPersonLogged();
		}
		
		function logout(){
			userPanelService.logPersonOut().then(function(data){
				pages.home();
			});
		}
		
		function refreshIsPersonLogged(){
			isPersonLoggedLoading = true;
			return userPanelService.checkPersonLogged().then(function(){
				var personLogged = userPanelService.isPersonLogged();
				// Automatically download user data if he is logged
				if(personLogged){
					refreshUserData();
				}
				isPersonLoggedLoading = false;
			});
		}
		
		function refreshUserData(){
			isUserDataLoading = true;
			return userPanelService.loadPersonData().then(function(data){
				ctrl.userData = data;
				isUserDataLoading = false;
			});
		}
		
		function isLoading(){
			return isPersonLoggedLoading || isUserDataLoading;
		}
		
		function isMyLibraryOpened(){
			return pages.isPageOpened('myLibrary') || pages.isPageOpened('collection') 
				|| pages.isPageOpened('addCollection') || pages.isPageOpened('word') 
				|| pages.isPageOpened('addWord') || pages.isPageOpened('editWord')
				|| pages.isPageOpened('learning') || pages.isPageOpened('uploadFile')
				|| pages.isPageOpened('editCollection');
		}
		
		function isPublicLibraryOpened(){
			return pages.isPageOpened('collectionPreview') || pages.isPageOpened('publicLibrary');
		}
		
		function getDownloadAndroidApkLink(){
			return config.androidApkDownloadLink;
		}
	}
}());