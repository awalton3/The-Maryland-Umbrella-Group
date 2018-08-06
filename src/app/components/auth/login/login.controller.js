function LoginController(AuthService, $state) {
  var ctrl = this;

  //initialize user data
  ctrl.$onInit = function() {
    ctrl.user = {
      email: '',
      password: '',
      type: ctrl.userType
    };
  };

  //give user access to app
  ctrl.loginUser = function (event) {
      return AuthService
          .login(event.user)
  }

  ctrl.reset = function(event) {
    console.log(event.email)
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
