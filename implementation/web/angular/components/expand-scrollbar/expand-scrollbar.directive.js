(function () {
	angular.module("wordStormApp.components")
	.directive("expandScrollbar", Directive);
	
	Directive.$inject = ["$parse"];
	function Directive($parse){
		 return {
			restrict: 'A',
	    	controller: DirectiveController,
	    	bindToController: true,
	    	priority: -1,
	    	link: function(scope, element, attrs, ctrl) {
			    var options =  $parse(attrs.expandScrollbar)(scope);
			    ctrl.init(options);
			}
	    };
	}
	
	DirectiveController.$inject = ["$timeout", "$element"];
	function DirectiveController($timeout, $element){
		var ctrl = this;
		var perfectScrollbar = $element;
		
		ctrl.init = init;
		
		//////////////////
		
		function init(options){
			if(options != null){
				initScrollToFunction(options);
			}
		}
		
		function initScrollToFunction(options){
			options.scrollTop = scrollTop;
		}
		
		// Repair this for infinite scroll
		function initInfiniteScroll(options){
			if(options.onScrollBottom != null){
				perfectScrollbar.on('ps-y-reach-end', options.onScrollBottom);
			}
			if(options.onScrollTop != null){
				perfectScrollbar.on('ps-y-reach-start', options.onScrollTop);
			}
		}
		
		function scrollTop(pos){
			 perfectScrollbar.scrollTop(pos);
		}
	}
}());