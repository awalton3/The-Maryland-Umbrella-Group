var register = {
    templateUrl: './register.html',
    controller: 'RegisterController',
    bindings: {
      userType: '@',
      onLogin: '&',
      onRegister: '&'
    }
};

angular
    .module('components.auth')
    .component('register', register);
