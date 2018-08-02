function AuthController($state) {
    var ctrl = this;

    ctrl.$onInit = function() {
      // define variables
      ctrl.showRegister = false;

      // define functions
      ctrl.toggleRegister = toggleRegister;
    }

    function toggleRegister() {
      ctrl.showRegister = !ctrl.showRegister;
    }


}

angular
    .module('components.auth')
    .controller('AuthController', AuthController);
