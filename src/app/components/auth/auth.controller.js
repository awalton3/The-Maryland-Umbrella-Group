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
      ctrl.showLogin = !ctrl.showLogin;

    }

    function toggleReset(event) {
      ctrl.showReset = !ctrl.showReset;
      ctrl.showLogin = !ctrl.showLogin;

    }

    function toggleLogin() {
      ctrl.showLogin = !ctrl.showLogin;
      ctrl.showReset = !ctrl.showReset;

    }

}

angular
    .module('components.auth')
    .controller('AuthController', AuthController);
