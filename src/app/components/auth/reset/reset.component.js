/**
 * @ngdoc component
 * @name component.auth:reset
 *
 * @description
 * This component handles password reset and is toggled in login component
 *
 */

var reset = {
    templateUrl: './reset.html',
    controller: 'ResetController',
    bindings: {
      onLogin: '&',
      userType: '@',
      userEmail: '<'
    }
};

angular
    .module('components.auth')
    .component('reset', reset);
    // .config(function ($stateProvider) {
    //     $stateProvider.state('auth.reset', {
    //         url: '/reset',
    //         component: 'reset'
    //     });
    // });
