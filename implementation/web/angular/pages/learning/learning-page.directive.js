(function () {
	angular.module("wordStormApp.pages")
	.directive("learningPage", Directive);
	
	function Directive(){
		 return {
	    	restrict: 'E',
	    	templateUrl: 'angular/pages/learning/learning-page.directive.html',
	    	controller: DirectiveController,
	    	controllerAs: 'ctrl',
	    	bindToController: true,
	    	scope: {}
	    };
	}
	
	var loadingData = {
		COLLECTION: false,
		INITIALIZING: false
	};
	
	var stats = {
		knownWords: null,
		unknownWords: null,
		words: null,
		orders: null
	};
	
	var views = {
		LEARNING: "angular/pages/learning/views/learning-page-main-view.html",
		SUCCESS: "angular/pages/learning/views/learning-page-success-view.html",
		NO_WORDS: "angular/pages/learning/views/learning-page-no-words-view.html"
	};
	
	DirectiveController.$inject = ['$stateParams', 'rest', 'pages'];
	function DirectiveController($stateParams, rest, pages){
		var ctrl = this;
		
		ctrl.collection = null;
		ctrl.words = null;
		ctrl.currentWord = null;
		ctrl.currentView = null;
		
		ctrl.showAllCollections = pages.myLibrary.allCollections;
		ctrl.openCollection = pages.myLibrary.collection;
		ctrl.isLoading = isLoading;
		ctrl.getProgressForKnownWords = getProgressForKnownWords;
		ctrl.getProgressForUnknownWords = getProgressForUnknownWords;
		ctrl.markWordAsKnown = markWordAsKnown;
		ctrl.markWordAsUnknown = markWordAsUnknown;
		ctrl.getResults = getResults;
		ctrl.restartLearning = restartLearning;
		ctrl.results = null;
		
		init();
		
		/////////////////////
		
		function init(){
			loadingData.INITIALIZING = true;
			
			ctrl.currentView = views.LEARNING;
			
			refreshCollection().then(function(){
				if(ctrl.words != null && ctrl.words.length > 0){
					initStatistics();
					handleNextWord();
				}
				else{
					ctrl.currentView = views.NO_WORDS;
				}
				
				loadingData.INITIALIZING = false;
			});
		}
		
		function refreshCollection(useCache, forceReload){
			var collectionId = $stateParams.collectionId;
			
			loadingData.COLLECTION = true;
			return rest.collection.get(collectionId).then(function(result){
				if(result.Result){
					ctrl.collection = result.Result;
					ctrl.words = result.Result.Words;
				}
				
				loadingData.COLLECTION = false;
			});
		}
		
		function initStatistics(){
			stats.knownWords = [];
			stats.unknownWords = [];
			stats.orders = [];
			stats.words = ctrl.words ? angular.copy(ctrl.words) :  [];
			ctrl.results = null;
		}
		
		function isLoading(){
			return loadingData.COLLECTION || loadingData.INITIALIZING;
		}
		
		function getProgressForKnownWords(){
			var result = 0;
			if(ctrl.words != null && stats.knownWords != null){
				result = 100.0 * stats.knownWords.length / ctrl.words.length ;
			}
			return result;
		}
		
		function getProgressForUnknownWords(){
			var result = 0;
			if(ctrl.words != null && stats.unknownWords != null){
				var allUnknownWords = stats.unknownWords.length;
				// Check if current word is in unknown
				if(ctrl.currentWord && ctrl.currentWord.__isUnknown){
					allUnknownWords += 1;
				}
				
				result = 100.0 * allUnknownWords / ctrl.words.length;
			}
			return result;
		}
		
		function getNextWord(useUnknowns){
			var result = null;
			if(stats.words.length > 0){
				result = stats.words.shift();
			}
			else if(useUnknowns && stats.unknownWords.length > 0){
				result = stats.unknownWords.shift();
			}
			
			return result;
		}
		
		function markWordAsKnown(){
			ctrl.currentWord.__isUnknown = false;
			stats.knownWords.push(ctrl.currentWord);
			addOrderToStats(ctrl.currentWord, true);
			handleNextWord();
		}
		
		function markWordAsUnknown(){
			ctrl.currentWord.__isUnknown = true;
			stats.unknownWords.push(ctrl.currentWord);
			addOrderToStats(ctrl.currentWord, false);
			handleNextWord();
		}
		
		function addOrderToStats(item, answer){
			stats.orders.push({id: item.Id, word: item.Word, answer: answer});
		}
		
		function handleNextWord(){
			ctrl.currentWord = getNextWord(false);
			if(ctrl.currentWord == null){
				ctrl.currentView = views.SUCCESS;
				ctrl.results = getResults();
			}
		}
		
		function findLongestCombo(){
			var combo = 0;
			var maxCombo = 0;
			for(var i = 0; i < stats.orders.length; i++){
				if(stats.orders[i].answer == true && (i == 0 || stats.orders[i-1].answer == true)){
					combo++;
					if(combo > maxCombo){
						maxCombo = combo;
					}
				}
				else{
					combo = 0;
				}
			}
			return maxCombo;
		}
		
		function getResults(){
			return {
				goodAnswers: stats.knownWords.length,
				wrongAnswers: stats.unknownWords.length,
				wrongWords: stats.unknownWords,
				combo: findLongestCombo()
			};
		}
		
		function restartLearning(){
			initStatistics();
			handleNextWord();
			ctrl.currentView = views.LEARNING;
		}
	}
}());