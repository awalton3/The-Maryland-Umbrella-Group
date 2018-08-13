function UploadsController($mdSidenav, $rootScope) {

  var ctrl = this;
  ctrl.$onInit = function() {
    //define variables
    ctrl.toggleLeft = buildToggler('left');
    ctrl.toggleRight = buildToggler('right');
    ctrl.isRightNavLocked = true;
    ctrl.user = $rootScope.currentUser;

    //define functions
    ctrl.buildToggler = buildToggler;
    ctrl.toggleNavs = toggleNavs;

  }

  function buildToggler(componentId) {
    return function() {
      $mdSidenav(componentId).toggle();
    };
  }

  function toggleNavs(componentId) {
    ctrl.isRightNavLocked = !ctrl.isRightNavLocked;
    buildToggler(componentId);
  }
}

angular
  .module('components.uploads')
  .controller('UploadsController', UploadsController);
