function AppSidenavController(AuthService, $state, $rootScope) {
  var ctrl = this;

  ctrl.$onInit = function() {
    //define variables
    ctrl.user = $rootScope.currentUser;
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
