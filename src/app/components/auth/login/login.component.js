var login = {
    templateUrl: './login.html',
    controller: 'LoginController',
    bindings: {
      userType: '@',
      onRegister: '&',
      onReset: '&'
    }
};

angular
    .module('components.auth')
    .component('login', login);
