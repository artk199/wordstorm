(function () {
	angular.module("wordStormApp.pages")
	.directive("mainPage", Directive);
	
	function Directive(){
		 return {
	    	restrict: 'E',
	    	templateUrl: 'angular/pages/main-page/main-page.directive.html',
	    	controller: DirectiveController,
	    	controllerAs: 'ctrl',
	    	bindToController: true,
	    	scope: {}
	    };
	}
	
	var views = {
		VIDEO : {
			name: "video",
			template: "angular/pages/main-page/views/main-page-video-view.html"	
		},
		ANOTHER : {
			name: "another",
			template: "angular/pages/main-page/views/main-page-another-view.html"	
		}
	};
	
	DirectiveController.$inject = ['userPanelService', 'pages', 'config'];
	function DirectiveController(userPanelService, pages, config){
		var ctrl = this;
		
		ctrl.androidApplicationDownloadLink = config.androidApkDownloadLink;
		ctrl.currentView = null;
		ctrl.isUserLogged = userPanelService.isPersonLogged;
		ctrl.openVideoView = openVideoView;
		ctrl.isVideoView = isVideoView;
		ctrl.openAnotherView = openAnotherView;
		ctrl.isAnotherView = isAnotherView;
		
		init();
		
		//////////////////////////////
		
		function init(){
			if(userPanelService.isPersonLogged()){
				pages.myLibrary.allCollections();
			}
			else{
				ctrl.currentView = views.VIDEO;
			}
		}
		
		function openVideoView(){
			ctrl.currentView = views.VIDEO;
		}
		
		function isVideoView(){
			return ctrl.currentView == views.VIDEO;
		}
		
		function openAnotherView(){
			ctrl.currentView = views.ANOTHER;
		}
		
		function isAnotherView(){
			return ctrl.currentView == views.ANOTHER;
		}
	}
}());