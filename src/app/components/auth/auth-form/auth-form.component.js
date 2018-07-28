/**
 * @ngdoc component
 * @name component.auth:authForm
 *
 * @description
 * This is the stateless component for auth form
 *
 * @example
 * login.htm
 <pre>
 <auth-form user="$ctrl.user" button="Login" on-submit="$ctrl.loginUser($event);" on-reset="$ctrl.goToReset();">
 </auth-form>
  </pre>
 *
 */

var authForm = {
    bindings: {
        user: '<',
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
