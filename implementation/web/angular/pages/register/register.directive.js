(function () {
	angular.module("wordStormApp.pages")
	.directive("registerPage", Directive);
	
	function Directive(){
		 return {
	    	restrict: 'E',
	    	templateUrl: 'angular/pages/register/register.directive.html',
	    	controller: DirectiveController,
	    	controllerAs: 'ctrl',
	    	bindToController: true,
	    	scope: {}
	    };
	}
	
	DirectiveController.$inject = ['rest', 'alerts'];
	function DirectiveController(rest, alerts){
		var ctrl = this;
		
		ctrl.formData = initFormData();
		ctrl.isPasswordValid = isPasswordValid;
		ctrl.clearForm = clearForm;
		ctrl.isFormFilled = isFormFilled;
		ctrl.register = registerUser;
		ctrl.formSending = false;
		ctrl.errors = null;
		
		/////////////////////
		
		function initFormData(){
			return {
				email: null,
				password: null,
				confirmPassword: null
			};
		}
		
		function isPasswordValid(){
			var password = ctrl.formData.password;
			var confirmPassword = ctrl.formData.confirmPassword;
			
			if(password != null && password == confirmPassword){
				return true;
			}
			return false;
		}
		
		function clearForm(registerForm){
			registerForm.$setPristine();
			registerForm.$setUntouched();
			ctrl.formData = initFormData();
			ctrl.errors = null;
		}
		
		function isFormFilled(){
			var originalValues = initFormData()
			return ctrl.formData.email != originalValues.email 
				|| ctrl.formData.password != originalValues.password
				|| ctrl.formData.confirmPassword != originalValues.confirmPassword;
		}
		
		function isFormValid(){
			return isPasswordValid() && ctrl.errors == null && ctrl.formData.email != null;
		}
		
		function registerUser(registerForm){
			ctrl.formSending = true;
			rest.register.create(ctrl.formData).then(function(data){
				if(data){
					// Services logic returned error
					if(data.responseError != null){
						handleFormError(data.responseError);
					}
					else{
						alerts.addGlobalAlert({
							title: 'register.alerts.success.title',
							titleParams: {name: ctrl.formData.email},
							subtitle: 'register.alerts.success.subtitle',
							type: 'success'
						});
						
						clearForm(registerForm);
					}
				}
				
				ctrl.formSending = false;
			});
		}
		
		function handleFormError(errors){
			ctrl.errors = {};
			
			for(var i = 0; i < errors.length; i++){
				var errorName = errors[i].ErrorName;
				switch(errorName){
					default: 
						ctrl.errors[errorName] = true;
					break;
				}	
			}
		}
	}
}());