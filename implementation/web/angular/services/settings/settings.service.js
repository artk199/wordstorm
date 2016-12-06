(function () {
	angular.module("wordStormApp.services")
	.service("settings", Service);
	
	Service.$inject = ['cookies', 'config'];
	function Service(cookies, config){	
		var SETTINGS = {
			DEFAULT_LIST_TYPE : {
				get: function(){return getSetting("defaultListType") || "grid"},
				set: function(value){return storeSetting("defaultListType", value)}
			},
			DEFAULT_LIST_PAGINATION : {
				get: function(){return getSetting("defaultListPagination") || config.defaultPaginationSize},
				set: function(value){return storeSetting("defaultListPagination", value)}
			},
			DEFAULT_SPECIAL_CHARACTERS_COLOR: {
				get: function(){return getSetting("defaultSpecialCharactersKeyboardColor") || "green"},
				set: function(value){return storeSetting("defaultSpecialCharactersKeyboardColor", value)}
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