function ResetController() {

    var ctrl = this;

    ctrl.$onInit = function () {
        // initialize variables
        ctrl.user = {};
        // initialize functions
        ctrl.reset = reset;
    }

    // function reset() {
    //   ctrl.onReset({
    //     $event: {
    //       email: ctrl.userEmail;
    //     }
    //   });
    // }
}

angular
    .module('components.auth')
    .controller('ResetController', ResetController);
