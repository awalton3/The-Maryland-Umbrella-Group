var reset = {
    templateUrl: './reset.html',
    controller: 'ResetController',
    bindings: {
      onLogin: '&',
      userType: '@',
      userEmail: '<',
      onReset: '&'
    }
};

angular
    .module('components.auth')
    .component('reset', reset);
