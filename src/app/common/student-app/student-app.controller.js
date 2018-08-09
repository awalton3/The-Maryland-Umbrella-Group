function TutorAppController(AuthService, $state) {
    var ctrl = this;
    ctrl.user = AuthService.getUser();
    ctrl.logout = function () {
        AuthService.logout()
            .then(function () {
                $state.go('auth');
            });
    };
}

angular
    .module('common')
    .controller('TutorAppController', TutorAppController);
