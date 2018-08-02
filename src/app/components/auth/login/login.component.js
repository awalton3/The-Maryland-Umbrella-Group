/**
 * @ngdoc component
 * @name component.auth:login
 *
 * @description
 * This component stores info from auth-form and handles login using AuthService
 *
 */

var login = {
    templateUrl: './login.html',
    controller: 'LoginController',
    bindings: {
      userType: '@',
      onRegister: '&'
    }
};

angular
    .module('components.auth')
    .component('login', login);
    // .config(function ($stateProvider, $urlRouterProvider) {
    //     $stateProvider
    //         // .state('auth', {
    //         //     redirectTo: 'auth.login',
    //         //     url: '/auth',
    //         //     template: '<div ui-view></div>'
    //         // })
            // .state('auth.login', {
            //     url: '/login',
            //     component: 'login'
            // });
    //     // $urlRouterProvider.otherwise('/auth/login');
    // });
