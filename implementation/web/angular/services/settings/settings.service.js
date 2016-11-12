(function () {
	angular.module("wordStormApp.services")
	.service("settings", Service);
	
	Service.$inject = ['cookies'];
	function Service(cookies){	
		var SETTINGS = {
			DEFAULT_LIST_TYPE : {
				get: function(){return getSetting("defaultListType") || "grid"},
				set: function(value){return storeSetting("defaultListType", value)}
			}
		};
		
		function getSetting(settingName, settingValue){
			return cookies.settings.get(settingName);
		}
		
		function storeSetting(settingName, settingValue){
			cookies.settings.store(settingName, settingValue);
		}
		
		return SETTINGS;
	}
}());