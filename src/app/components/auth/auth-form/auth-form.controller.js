function AuthFormController() {
  
  var ctrl = this;

  ctrl.$onInit = function() {
    ctrl.submitForm = submitForm;
    ctrl.reset = reset;
  }

  ctrl.$onChanges = function(changes) {
    if (changes.user) {
      ctrl.user = angular.copy(ctrl.user);
    }
  };

// function passes click event with user object to login component
  function submitForm() {
    ctrl.onSubmit({
      $event: {
        user: ctrl.user
      }
    });
  };

// function passes click event with user email to login component
  function reset() {
    ctrl.onReset({
      $event: {
        email: ctrl.user.email
      }
    });
  };

}

angular
  .module('components.auth')
  .controller('AuthFormController', AuthFormController);
