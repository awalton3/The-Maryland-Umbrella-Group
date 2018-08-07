function ResetController() {

  var ctrl = this;

  ctrl.$onInit = function() {
    // initialize variables
    ctrl.user = {};
    
  }

}


angular
  .module('components.auth')
  .controller('ResetController', ResetController);
