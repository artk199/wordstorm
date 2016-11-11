(function () {
	angular.module("wordStormApp.components")
	.directive("alerts", Directive);
	
	function Directive(){
		 return {
	    	restrict: 'E',
	    	templateUrl: 'angular/components/alerts/alerts.directive.html',
	    	controller: DirectiveController,
	    	controllerAs: 'ctrl',
	    	bindToController: true,
	    	scope: {
	    		group: '@',
	    		overflowing: '='
	    	}
	    };
	}
	
	var ALERT_TYPES = {
		SUCCESS : "success",
		WARNING : "warning",
		ERROR   : "error"
	};
	
	DirectiveController.$inject = ['alerts'];
	function DirectiveController(alerts){
		var ctrl = this;
		
		ctrl.alerts = getAlertsFromService();
		ctrl.getIconForAlert = getIconForAlert;
		ctrl.removeAlert = removeAlert;
		
		///////
		
		function getAlertsFromService(){
			return alerts.getAlertsForGroup(ctrl.group);
		}
		
		function getIconForAlert(alert){
			var result = null;
			if(alert.icon != null){
				result = 'glyphicon-' + alert.icon;
			}
			else{
				switch(alert.type){
					case ALERT_TYPES.ERROR:
						result = 'glyphicon-remove';
					break;
					case ALERT_TYPES.WARNING:
						result = 'glyphicon-exclamation-sign';
					break;
					default:
						result = 'glyphicon-ok';
				};
			}
			
			return result;
		}
		
		function removeAlert(alert){
			alerts.removeAlert(alert, ctrl.group);
		}
	}
}());