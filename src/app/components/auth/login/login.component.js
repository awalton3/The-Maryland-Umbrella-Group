var login = {
    templateUrl: './login.html',
    controller: 'LoginController',
    bindings: {
      userType: '@',
      onRegister: '&',
      onReset: '&',
      onLogin: '&'
    }
};

angular
    .module('components.auth')
    .component('login', login);
