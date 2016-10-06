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
		
		ctrl.open = openSidebar;
		ctrl.isPageOpened = pages.isPageOpened;
		ctrl.openExamplePage = pages.examplePage;
		ctrl.openExamplePage2 = pages.examplePage2;
		ctrl.isPersonLogged = userPanelService.isPersonLogged;
		
		////////////////////////
		
		function openSidebar(option){
			ctrl.sidebarOpened = !ctrl.sidebarOpened;
		}
	}
}());