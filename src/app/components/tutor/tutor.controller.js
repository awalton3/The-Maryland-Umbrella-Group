function TutorController($mdSidenav) {

  var ctrl = this;
  ctrl.$onInit = function() {
    //define variables
    ctrl.toggleLeft = buildToggler('left')

    //define functions
    ctrl.buildToggler = buildToggler;

  }

  function buildToggler(componentId) {
    return function() {
      $mdSidenav(componentId).toggle();
    };
  }

}

angular
  .module('components.tutor')
  .controller('TutorController', TutorController);
