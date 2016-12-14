(function () {
	angular.module("wordStormApp.pages")
	.directive("contactUsPage", Directive);
	
	function Directive(){
		 return {
	    	restrict: 'E',
	    	templateUrl: 'angular/pages/contact-us/contact-us-page.directive.html',
	    	controller: DirectiveController,
	    	controllerAs: 'ctrl',
	    	bindToController: true,
	    	scope: {}
	    };
	}
	
	DirectiveController.$inject = ['rest', 'alerts', 'userPanelService'];
	function DirectiveController(rest, alerts, userPanelService){
		var ctrl = this;
		var loading = false;
		var userEmail = null;
		
		ctrl.formSending = false;
		ctrl.formData = null;
		
		ctrl.clearForm = clearForm;
		ctrl.isLoading = isLoading;
		ctrl.send = send;
		
		init();
		
		///////////////////////
		
		function isLoading(){
			return loading;
		}
		
		function init(){
			refreshUserData().then(function(){
				ctrl.formData = initFormData();
			});
		}
		
		function refreshUserData(){
			loading = true;
			return userPanelService.loadPersonData().then(function(data){
				userEmail = data != null ? data.Email : null;
				loading = false;
			});
		}
		
		function initFormData(){
			return {
				email: userEmail,
				text: null
			}
		}
		
		function clearForm(){
			ctrl.formData = initFormData();
		}
		
		function send(){
			ctrl.formSending = true;
			rest.contactUs.send(ctrl.formData.email, ctrl.formData.text).then(function(data){
				alerts.addGlobalAlert({
					title: 'contactUs.alert.title',
					titleParams: {email: ctrl.formData.email},
					type: 'success'
				});
				
				clearForm();
				ctrl.formSending = false;
			});
		}
	}
}());