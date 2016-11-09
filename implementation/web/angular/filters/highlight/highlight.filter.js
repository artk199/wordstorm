(function () {
	angular.module("wordStormApp.filters")
	.filter("highlight", Filter);
	
	Filter.$inject = ['$sce'];
	function Filter($sce){
		return function(text, phrase) {
			text = text != null ? text.toString() :  "";
		    if (phrase) {
		    	var keywords = phrase.replace(/\s/g, "|");
	    		var regexp = new RegExp('('+keywords+')', 'gi');
		    	text = text.replace(regexp, '<span class="highlighted">$&</span>');
		    }
	    	
		    return $sce.trustAsHtml(text)
	    };
	}

}());