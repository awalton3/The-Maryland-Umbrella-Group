/**
 * @ngdoc component
 * @name component.auth:register
 *
 * @description
 * This component stores info from auth-form and handles registering using AuthService
 *
 */

var register = {
    templateUrl: './register.html',
    controller: 'RegisterController',
    bindings: {
      userType: '@',
      onLogin: '&'
    }
};

angular
    .module('components.auth')
    .component('register', register);
    // .config(function ($stateProvider) {
    //     $stateProvider.state('auth.register', {
    //         url: '/register',
    //         component: 'register'
    //     });
    // });
