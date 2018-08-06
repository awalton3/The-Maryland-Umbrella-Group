function RegisterController(AuthService, $state) {
    var ctrl = this;

    //initialize user data
    ctrl.$onInit = function () {
        ctrl.error = null;
        ctrl.user = {
            email: '',
            password: '',
            type: ctrl.userType
        };
    };

    //creates a new user and allows access into the app
    ctrl.createUser = function (event) {
        return AuthService
            .register(event.user)
            // .alertVerification(event.user.email)
    };

}

angular
    .module('components.auth')
    .controller('RegisterController', RegisterController);
