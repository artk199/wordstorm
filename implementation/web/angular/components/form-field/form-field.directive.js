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
	    		tooltip: '@',
	    		form: '=',
	    		labelPosition: '@',
	    		useAutoFocus: '=',
	    		selectOptions: '='
	    	},
	    	transclude:{
	    		errors: '?fieldErrors',
	    		ownField: '?fieldOwnInput'
	    	}
	    };
	}
	
	var labelPositions = {
		TOP: "top",
		LEFT: "left",
		NONE: "none"
	};
	
	DirectiveController.$inject = ['$sce'];
	function DirectiveController($sce){
		var ctrl = this;
		
		ctrl.getTooltipContent = getTooltipContent;
		ctrl.getColumSizeForLabel = getColumSizeForLabel;
		ctrl.getColumSizeForInput = getColumSizeForInput;
		
		/////////
		
		function getTooltipContent(){
			return $sce.trustAsHtml(ctrl.tooltip);
		}
		
		function getColumSizeForLabel(){
			var result = "field-label";
			switch(ctrl.labelPosition){
				case labelPositions.TOP:
					result += " col-xs-12 col-sm-12 col-md-12 col-lg-12 top";
				break;
				case labelPositions.NONE:
					result += " hidden-xs hidden-sm hidden-md hidden-lg none";
				break;
				default:
					result += " col-xs-12 col-sm-5 col-md-4 col-lg-4 left";
			};
			return result;
		}
		
		function getColumSizeForInput(){
			var result = "field-input";
			switch(ctrl.labelPosition){
				case labelPositions.TOP:
					result += " col-xs-10 col-sm-10 col-md-10 col-lg-10 top";
				break;
				case labelPositions.NONE:
					result += " col-xs-10 col-sm-10 col-md-10 col-lg-10 none";
				break;
				default:
					result += " col-xs-10 col-sm-5 col-md-6 col-lg-6 left";
			};
			return result;
		}
	}
}());