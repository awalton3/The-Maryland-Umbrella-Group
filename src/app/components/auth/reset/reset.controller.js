function ResetController() {

    var ctrl = this;

    ctrl.$onInit = function () {
        // initialize variables
        ctrl.user = {};
        // initialize functions
        ctrl.reset = reset;
    }

    // password reset
    function reset(email) {
        if (email) {
            Parse
                .User
                .requestPasswordReset(email)
                .then(function () {
                    alert('A password reset email has been sent to ' + email);
                })
                .catch(function (err) {
                    alert(err.code + " " + err.message);
                });
        }
    }

}

angular
    .module('components.auth')
    .controller('ResetController', ResetController);
