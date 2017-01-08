(function () {
	angular.module("wordStormApp.components")
	.directive("specialCharactersKeyboard", Directive);
	
	function Directive(){
		 return {
	    	restrict: 'E',
	    	templateUrl: 'angular/components/special-characters-keyboard/special-characters-keyboard.directive.html',
	    	controller: DirectiveController,
	    	controllerAs: 'ctrl',
	    	bindToController: true,
	    	scope: {
	    		model: '=',
	    		isRequired: '=',
	    		display: '@',
	    		name: "@",
	    		placeholder: '@'
	    	}
	    };
	}
	
	var colors = ["green", "blue", "orange"];
	
	var closingPolicy = {
		ALWAYS: "always",
		OUTSIDE: "outsideClick",
		DISABLED: "disabled"
	};
	
	var displayType = {
		WITH_BUTTON: "button",
		SIMPLE: "simple"
	};
	
	DirectiveController.$inject = ['config', 'settings', '$element'];
	function DirectiveController(config, settings, $element){
		var ctrl = this;
		
		ctrl.englishCharacters = config.specialCharacters.english;
		ctrl.polishCharacters = config.specialCharacters.polish;
		ctrl.keyboardColors = colors;
		ctrl.keyboardColor = initKeyboardColor();
		ctrl.closingPolicy = initDisplayPolicy();
		
		ctrl.changeKeysColor = changeKeysColor;
		ctrl.addCharacter = addCharacter;
		ctrl.isWithButton = isWithButton;
		ctrl.isOpen = isOpen;
		
		//////////////////////////
		function initKeyboardColor(){
			return settings.DEFAULT_SPECIAL_CHARACTERS_COLOR.get();
		}
		
		function initDisplayPolicy(){
			return displayType.SIMPLE == ctrl.display ? closingPolicy.DISABLED : closingPolicy.OUTSIDE;
		}
		
		function addCharacter(character){
			if(ctrl.model == null){
				ctrl.model = (character);
			}
			else{
				ctrl.model += (character);
			}
			focusInput();
		}
		
		function changeKeysColor(color){
			ctrl.keyboardColor = color;
			settings.DEFAULT_SPECIAL_CHARACTERS_COLOR.set(color);
		}
		
		function isWithButton(){
			return displayType.WITH_BUTTON == ctrl.display;
		}
		
		function isOpen(){
			return displayType.SIMPLE == ctrl.display;
		}
		
		function focusInput(){
			 var input = $element.find(".characters-input");
			 if(input != null){
				 input[0].focus(); 
			 }
		}
	}
}());