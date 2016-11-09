(function () {
	// --------- PRE-ANGULAR ---------
	var externalConfig = {};
	var globalInfo = {};
	
	$.ajax({
	    dataType: 'json',
	    url: 'angular/config/applicationConfiguration.json',
	    async: false,
	    success: function(data) {
	        externalConfig = data;
	    },
	    error: function(error){
	    	var message;
	    	switch(error.status){
	    		case 404:
	    			message = "No application config file found at url: angular/config/applicationConfiguration.json";
	    		break;
	    		default:
	    			message = "Something is wrong with application config file at url: angular/config/applicationConfiguration.json";
	    	}
	    	
	    	globalInfo.error = {
	    		message: message,
	    		status: error.status
	    	};
	    }
	})
	.always(function() {
	    angular.element(document).ready(function() {
	        angular.bootstrap(document, ['wordStormApp']);
	    });
	});
	
	// --------- DEPENDENCIES ---------
	var app = angular.module('wordStormApp', [
	  'wordStormApp.components',
	  'wordStormApp.services',
	  'wordStormApp.filters',
	  'pascalprecht.translate',
	  'ui.router',
	  "ngCookies",
	  'ui.bootstrap',
	  'angular.filter',
	  'perfect_scrollbar'
	]);

	app.constant("config", externalConfig);
	
	// --------- CONFIG BLOCKS ---------
	// Config routing
	app.config(['$locationProvider', 'config',
		function($locationProvider, config) {
			var useHtml5Mode = config.html5Mode || false;
			
			$locationProvider.html5Mode({
				  enabled: useHtml5Mode,
				  requireBase: true
			});
	}]);
	
	// Config translations
	app.config(['$translateProvider', 'config', 
	  function ($translateProvider, config) {
		var allowedLanguages = config.allowedLanguages;
		var localeFiles = [];
		if(allowedLanguages != null){
			for(var i = 0; i < allowedLanguages.length; i++){
				var lang = allowedLanguages[i];
				
				localeFiles.push({url: 'angular/languages/locale-' + lang + '.json', lang: lang});
				localeFiles.push({url: 'angular/languages/errors-' + lang + '.json', lang: lang});
			}
			
			loadLocaleFiles(localeFiles, $translateProvider);
			$translateProvider.preferredLanguage(config.defaultLanguage);
		}
	}]);
	
	function loadLocaleFiles(filesArray, $translateProvider){
		for(var i = 0; i < filesArray.length; i++){
			var url = filesArray[i].url;
			var lang = filesArray[i].lang;
			
			$.ajax({
			    dataType: 'json',
			    url: url,
			    async: false,
			    success: function(data) {
			    	$translateProvider.translations(lang, data);
			    },
			    error: function(error){
			    	var message;
			    	switch(error.status){
			    		case 404:
			    			message = "No translations file found at url: " + url;
			    		break;
			    		default:
			    			message = "Something is wrong with translations file at url: " + url;
			    	}
			    	
			    	globalInfo.error = {
			    		message: message,
			    		status: error.status
			    	};
			    }
			});
		}
	}
	
	// Config injectors
	app.config(['$httpProvider',
		function($httpProvider){	
			$httpProvider.interceptors.push('httpInterceptor');
	}]);
	
	
	// Handle configuring errors
	app.run(['pages', function(pages) {
		 if(globalInfo.error != null && globalInfo.error != {}){
			 pages.error(globalInfo.error);
		 }
	}]);
	
	// --------- DEFINE MODULES USED IN APPLICATION ---------
	angular.module('wordStormApp.services', []);
	angular.module('wordStormApp.filters', []);
	angular.module('wordStormApp.components', []);
}());