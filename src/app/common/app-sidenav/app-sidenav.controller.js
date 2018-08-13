function AppSidenavController(AuthService, $state, $rootScope) {
  var ctrl = this;

  ctrl.$onInit = function() {
    //define variables
    ctrl.user = $rootScope.currentUser;
    //define functions
    ctrl.logout = logout;
    ctrl.goToHourLog = goToHourLog;
    ctrl.goToUploads = goToUploads;
  }

  function logout() {
    AuthService.logout()
      .then(() => {
        $state.go('auth');
      });
  };

  function goToHourLog() {
    $state.go('hours')
  }

  function goToUploads() {
    $state.go('uploads')
  }

}

angular
  .module('common')
  .controller('AppSidenavController', AppSidenavController);
