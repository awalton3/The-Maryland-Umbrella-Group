function AuthController($state) {
    var ctrl = this;

    ctrl.$onInit = function() {
      // define variables
      ctrl.showRegister = false;
      ctrl.showReset = false;
      ctrl.showLogin = true;

      // define functions
      ctrl.toggleRegister = toggleRegister;
      ctrl.toggleReset = toggleReset;
      ctrl.toggleLogin = toggleLogin;
    }

    function toggleRegister() {
      ctrl.showRegister = !ctrl.showRegister;
      toggleLogin()
    }

    function toggleReset() {
      ctrl.showReset = !ctrl.showReset;
      toggleLogin();
    }

    function toggleLogin() {
      ctrl.showLogin = !ctrl.showLogin;
    }

}

angular
    .module('components.auth')
    .controller('AuthController', AuthController);
