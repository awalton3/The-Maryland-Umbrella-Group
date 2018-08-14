function HoursController($mdSidenav, $rootScope) {
  var ctrl = this;

  ctrl.$onInit = function() {
    //define variables
    ctrl.user = $rootScope.currentUser;

    //define functions

  }
}

angular
  .module('components.hours')
  .controller('HoursController', HoursController);
