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
		SPEAKING: 'speaking',
		LISTENING: 'listening',
		OPTION3: 'option3'
	};
	
	var backgroundImages = {
		BOOKS: 'studying',
		TABLET: 'option3',
		TABLE: 'listening'
	}
	
	DirectiveController.$inject = ['$interval', '$scope'];
	function DirectiveController($interval, $scope){
		var ctrl = this;
		
		ctrl.views = views;
		ctrl.view = views.SPEAKING;
		
		ctrl.changeOption = changeOption;
		ctrl.getBackgroundImage = getBackgroundImage;
		
		$scope.$on("destroy", unregisterChangeOptionInterval);
		
		//////////////////////////////
		
		var changeOptionInterval = $interval(changeOptionToNext, 3000);
		
		function changeOptionToNext(){
			switch(ctrl.view){
				case views.SPEAKING:
					ctrl.view = views.LISTENING;
				break;
				case views.LISTENING:
					ctrl.view = views.OPTION3;
				break;
				case views.OPTION3:
					ctrl.view = views.SPEAKING;
				break;
			}
		}
		
		function changeOption(option){
			ctrl.view = option;
			unregisterChangeOptionInterval();
		}
		
		function getBackgroundImage(){
			var restult = "";
			switch(ctrl.view){
				case ctrl.views.SPEAKING:
					result = backgroundImages.BOOKS;
				break;
				case ctrl.views.LISTENING:
					result = backgroundImages.TABLET;
				break;
				case ctrl.views.OPTION3:
					result = backgroundImages.TABLE;
				break;
			}
			
			return result;
		}
		
		function unregisterChangeOptionInterval(){
			if(changeOptionInterval != null){
				$interval.cancel(changeOptionInterval);
			}
		}
	}
}());