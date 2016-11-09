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
	    		tooltip: '@'
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
	
	DirectiveController.$inject = ['$element'];
	function DirectiveController($element){
		var ctrl = this;
		var bar = null;
		
		initProgressBar();
		
		////////////////////////
		
		function initProgressBar(){
			var container = $element.find(".progress-bar")[0];
			var color = getProgressBarColor();
			bar = new ProgressBar.Circle(container, {
				  color: 'transparent',
				  trailColor: '#eee',
				  fill: ctrl.background,
				  trailWidth: 1,
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

				bar.animate(ctrl.progress);  // Number from 0.0 to 1.0
		}
		
		function getProgressBarColor(){
			return colors.GREEN;
		}
	}
}());