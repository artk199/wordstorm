(function () {
	angular.module("wordStormApp.components")
	.directive("page", Directive);
	
	function Directive(){
		 return {
	    	restrict: 'E',
	    	templateUrl: 'angular/components/page/page.directive.html',
	    	controller: DirectiveController,
	    	controllerAs: 'ctrl',
	    	bindToController: true,
	    	scope: {
	    		backgroundImage: '@',
	    		pageClass: '@',
	    		headerClass: '@',
	    		bodyClass: '@',
	    		isLoading: '=',
	    		scrollableBody: '=',
	    		disallowNotLogged: '='
	    	},
	    	transclude: {
	    		header: '?pageHeader',
	    		headerLeft: '?pageHeaderLeft',
	    		headerRight: '?pageHeaderRight',
	    		body: 'pageBody',
	    		footer: '?pageFooter',
	    		bodyTop: '?pageBodyTop'
	    	}
	    };
	}
	
	DirectiveController.$inject = ['$transclude', 'userPanelService', 'pages'];
	function DirectiveController($transclude, userPanelService, pages){
		var ctrl = this;
		
		ctrl.isTranscludeGiven = isTranscludeGiven;
		ctrl.showHeader = showHeader;
		
		init();
		
		//////////////////
		
		function init(){
			if(ctrl.disallowNotLogged){
				userPanelService.checkPersonLogged().then(function(){
					var isLogged = userPanelService.isPersonLogged();
					if(!isLogged){
						pages.authError();
					}
				});
			}
		}
			
		function isTranscludeGiven(slot){
			return $transclude.isSlotFilled(slot);
		}
		
		function showHeader(){
			return isTranscludeGiven('header') 
				|| isTranscludeGiven('headerLeft') 
				|| isTranscludeGiven('headerRight');
		}
	}
}());