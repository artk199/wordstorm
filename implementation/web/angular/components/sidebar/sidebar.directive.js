(function () {
	angular.module("wordStormApp.components")
	.directive("sidebar", Directive);
	
	function Directive(){
		 return {
	    	restrict: 'E',
	    	templateUrl: 'angular/components/sidebar/sidebar.directive.html',
	    	controller: DirectiveController,
	    	controllerAs: 'ctrl',
	    	bindToController: true,
	    	scope: {}
	    };
	}
	
	DirectiveController.$inject = ['pages', 'userPanelService'];
	function DirectiveController(pages, userPanelService){
		var ctrl = this;
		ctrl.sidebarOpened = false;
		
		ctrl.toggleSidebar = toggleSidebar;
		ctrl.closeSidebar = closeSidebar;
		ctrl.openSidebar = openSidebar;
		ctrl.isPageOpened = pages.isPageOpened;
		ctrl.isPersonLogged = userPanelService.isPersonLogged;
		ctrl.openMyLibrary = pages.myLibrary.allCollections;
		ctrl.openPublicLibrary = pages.publicLibrary.main;
		ctrl.openRegisterPage = pages.register;
		ctrl.openUploadFilePage = pages.uploadFile;
		
		////////////////////////
		
		function toggleSidebar(){
			ctrl.sidebarOpened = !ctrl.sidebarOpened;
		}
		
		function closeSidebar(){
			ctrl.sidebarOpened = false;	
		}
		
		function openSidebar(){
			ctrl.sidebarOpened = true;
		}
	}
}());