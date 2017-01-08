(function () {
	angular.module("wordStormApp.components")
	.directive("progressBar", Directive);
	
	function Directive(){
		 return {
	    	restrict: 'E',
	    	templateUrl: 'angular/components/progress-bar/progress-bar.directive.html',
	    	controller: DirectiveController,
	    	controllerAs: 'ctrl',
	    	bindToController: true,
	    	scope: {
	    		progress: '=',
	    		maxProgress: '=',
	    		type: '@',
	    		background: '@',
	    		tooltip: '@',
	    		repeat: '='
	    	},
	    	transclude: {
	    		content: '?progressContent'
	    	}
	    };
	}
	
	var PROGRESS_BAR_CONTAINER_NAME = ".progress-bar";
	var colors = {
		GREEN: {
			FROM: '#9a0808',
			TO: '#5db100'
		}
	}
	
	DirectiveController.$inject = ['$element', '$timeout', '$scope'];
	function DirectiveController($element, $timeout, $scope){
		var ctrl = this;
		var bar = null;
		
		$timeout(initProgressBar, 0);
		
		////////////////////////
		
		function initProgressBar(){
			var bar = initProgressbar(ctrl.type);
			
			if(bar != null){
				bar.animate(ctrl.progress, null, animationEndedFunction(bar));  // Number from 0.0 to 1.0
				
				$scope.$on('$destroy', function() {
					bar.stop();
		        });
			}
		}
		
		function getProgressBarColor(){
			return colors.GREEN;
		}
		
		function initProgressbar(type){
			var result = null;
			var containerName = getContainerForProgressbar(type);
		
			var color = getProgressBarColor();
			switch(type){
				case "heart" : 
					var $container = $(containerName);
					if($container != null && $container[0] != null){
						result = new ProgressBar.Path(containerName, {
							 easing: 'easeInOut',
							 duration: 3400
						});
						result.set(0);
					}
				break;
				default: 
					var container = $element.find(containerName)[0];
					result = new ProgressBar.Circle(container, {
						  color: 'transparent',
						  trailColor: '#ccc',
						  fill: ctrl.background,
						  trailWidth: 2,
						  duration: 3000,
						  easing: 'bounce',
						  strokeWidth: 3,
						  from: {color: color.FROM, a:0},
						  to: {color: color.TO, a:ctrl.maxProgress ? ctrl.maxProgress : 1},
						  // Set default step function for all animate calls
						  step: function(state, circle) {
						    circle.path.setAttribute('stroke', state.color);
						  }
						});
			}
			
			return result;
		}
		
		function getContainerForProgressbar(type){
			var result = ".progress-bar .container";
			switch(type){
				case "heart" :
					result += " .heart .heart-path"; 
				break;
				default:
					result += " ." + (type || "circle");
			}
			return result;
		}
		
		function animationEndedFunction(bar){
			if(ctrl.repeat){
				return repeatFunction(bar);
			}
		}
		
		function repeatFunction(bar){
			return function(){
				var val = bar.value() > 0 ? 0 : 1;
				bar.animate(val, null, animationEndedFunction(bar));  // Number from 0.0 to 1.0
			}
		}
	}
}());