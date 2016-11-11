(function () {
	angular.module("wordStormApp.services")
	.service("alerts", Service);
	
	var GLOBAL_ALERTS_GROUP = "global-alerts";
	
	Service.$inject = ['config', '$timeout'];
	function Service(config, $timeout){
		var service = this;
		var alerts = {};
		
		service.addGlobalAlert = addGlobalAlert;
		service.getAlertsForGroup = getAlertsForGroup;
		service.removeAlert = removeAlert;
		
		//////
		
		function addGlobalAlert(alertObj){
			addAlert(alertObj, GLOBAL_ALERTS_GROUP);
		}
		
		function addAlert(alertObj, group){
			var gr = getOrCreateGroupIfNotExisting(group);
			
			// Check if alert should be auto-deleted after certain time
			if(alertObj.autoDelete != false){
				var time = alertObj.displayTime || config.defaultAlertsDisplayTimeInSec;
				$timeout(function(){removeAlert(alertObj, group)}, time * 1000);
			}
			gr.push(alertObj);
		}
		
		function getOrCreateGroupIfNotExisting(group){
			var gr = alerts[group];
			if(gr == null){
				alerts[group] = [];
				gr = alerts[group]
			}
			return gr;
		}
		
		function getAlertsForGroup(group){
			return getOrCreateGroupIfNotExisting(group);
		}
		
		function removeAlert(alertObj, group){
			group = group || GLOBAL_ALERTS_GROUP;
			
			var gr = getAlertsForGroup(group);
			for(var i = 0; i < gr.length; i++){
				if(gr[i].title == alertObj.title){
					gr.splice(i, 1);
					break;
				}
			}
		}
	}
}());