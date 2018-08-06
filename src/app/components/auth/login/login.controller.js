function LoginController(AuthService, $state) {
    var ctrl = this;

    //initialize user data
    ctrl.$onInit = function () {
        ctrl.user = {
            email: '',
            password: ''
        };
    };

  //give user access to app
  ctrl.loginUser = function (event) {
    return AuthService
      .login(event.user)
      .then(function () {
        $state.go('app');
      }, function (reason) {
        alert(reason);
      });
  };

  ctrl.reset = function(event) {
    console.log(event.email)
    ctrl.onReset({
      $event: {
        email: event.email
      }
    });
  };

  // ctrl.goToReset = function () {
  //   $state.go('auth.reset');
  // }

}

angular
    .module('components.auth')
    .controller('LoginController', LoginController);
