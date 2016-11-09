(function () {
	angular.module("wordStormApp.components")
	.directive("formField", Directive);
	
	function Directive(){
		 return {
	    	restrict: 'E',
	    	templateUrl: 'angular/components/form-field/form-field.directive.html',
	    	controller: DirectiveController,
	    	controllerAs: 'ctrl',
	    	bindToController: true,
	    	scope: {
	    		name: '@',
	    		type: '@',
	    		placeholder: '@',
	    		label: '@',
	    		model: '=',
	    		errorOccured: '=',
	    		isRequired: '=',
	    		tooltip: '@'
	    	},
	    	transclude:{
	    		errors: '?fieldErrors'
	    	}
	    };
	}
	
	DirectiveController.$inject = ['$sce'];
	function DirectiveController($sce){
		var ctrl = this;
		
		ctrl.getTooltipContent = getTooltipContent;
		
		/////////
		
		function getTooltipContent(){
			return $sce.trustAsHtml(ctrl.tooltip);
		}
	}
}());