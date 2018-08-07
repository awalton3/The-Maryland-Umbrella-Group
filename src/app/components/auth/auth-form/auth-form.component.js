var authForm = {
    bindings: {
        user: '<',
        userType: '<',
        button: '@',
        message: '@',
        onSubmit: '&',
        onReset: '&'
    },
    templateUrl: './auth-form.html',
    controller: 'AuthFormController'
};

angular
    .module('components.auth')
    .component('authForm', authForm);
