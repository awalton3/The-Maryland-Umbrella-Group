function RegisterController() {
  var ctrl = this;

  ctrl.$onInit = function() {
    //define variables
    ctrl.error = null;
    ctrl.user = {
      email: '',
      password: '',
      type: ctrl.userType
    };
    ///define functions
    ctrl.register = register;
  };

  function register(event) {
    ctrl.onRegister({
      $event: {
        user: event.user
      }
    });
  };
}

angular
  .module('components.auth')
  .controller('RegisterController', RegisterController);
