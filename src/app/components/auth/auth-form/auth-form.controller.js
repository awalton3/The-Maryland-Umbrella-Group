function AuthFormController($state) {
  var ctrl = this;

  ctrl.$onChanges = function (changes) {
    if (changes.user) {
      ctrl.user = angular.copy(ctrl.user);
    }
  };

  ctrl.submitForm = function () {
    //console.log("submit called");
    ctrl.onSubmit({
      $event: {
        user: ctrl.user
      }
    });
  };

  ctrl.reset = function() {
    ctrl.onReset({
      $event: {
        email: ctrl.user.email
      }
    });
  };
}

angular
    .module('components.auth')
    .controller('AuthFormController', AuthFormController);
