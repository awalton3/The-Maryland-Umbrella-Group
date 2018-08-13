function AppSidenavController(AuthService, $state) {
  var ctrl = this;

  ctrl.$onInit = function() {
    //define variables
    //define functions
    ctrl.logout = logout;
  }

  function logout() {
    AuthService.logout()
      .then(() => {
        $state.go('auth');
      });
  };

}

angular
  .module('common')
  .controller('AppSidenavController', AppSidenavController);
