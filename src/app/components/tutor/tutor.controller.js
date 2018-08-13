function TutorController($mdSidenav) {

  var ctrl = this;
  ctrl.$onInit = function() {
    //define variables
    ctrl.toggleLeft = buildToggler('left');
    ctrl.toggleRight = buildToggler('right');
    ctrl.isRightNavLocked = true;

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
  .module('components.tutor')
  .controller('TutorController', TutorController);
