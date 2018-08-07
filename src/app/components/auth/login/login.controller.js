function LoginController(AuthService, $state) {
  var ctrl = this;

  //initialize user data
  ctrl.$onInit = function() {
    //define variables
      ctrl.user = {
          email: '',
          password: '',
          type: ctrl.userType
      };

    ///define functions
    ctrl.login = login;
    ctrl.reset = reset;
  };

  function login(event) {
    ctrl.onLogin({
      $event: {
        user: event.user
      }
    });
  };

  function reset(event) {
    ctrl.onReset({
      $event: {
        email: event.email
      }
    });
  };

}

angular
  .module('components.auth')
  .controller('LoginController', LoginController);
