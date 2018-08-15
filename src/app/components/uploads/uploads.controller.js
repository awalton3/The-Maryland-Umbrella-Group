function UploadsController($mdSidenav, $rootScope) {

  var ctrl = this;
  ctrl.$onInit = function() {
    //define variables
    ctrl.user = $rootScope.currentUser;

    //define functions
    console.log($rootScope.currentUser);
  }
}

angular
  .module('components.uploads')
  .controller('UploadsController', UploadsController);
