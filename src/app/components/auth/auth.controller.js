function AuthController(AuthService) {
  var ctrl = this;

  ctrl.$onInit = function() {
    // define variables
    ctrl.showRegister = false;
    ctrl.showReset = false;
    ctrl.showLogin = true;

    // define functions
    ctrl.toggleRegister = toggleRegister;
    ctrl.toggleReset = toggleReset;
    ctrl.toggleLogin = toggleLogin;
    ctrl.register = register;
    ctrl.login = login;
    ctrl.reset = reset;
  }

  function toggleRegister() {
    ctrl.showRegister = !ctrl.showRegister;
    ctrl.showLogin = !ctrl.showLogin;
  }

  function toggleReset(event) {
    ctrl.userEmail = event.email;
    ctrl.showReset = !ctrl.showReset;
    ctrl.showLogin = !ctrl.showLogin;
  }

  function toggleLogin() {
    ctrl.showLogin = !ctrl.showLogin;
    ctrl.showReset = !ctrl.showReset;
  }

  function login(event) {
    return AuthService.login(event.user)
  }

  function register(event) {
    return AuthService.register(event.user)
      .signUp(null)
      .then(() => {
        alert("A verfication email has been sent to " + event.user.email)
        return AuthService.logout()
          .then(() => {
            toggleRegister();
          })
      })
      .catch(error => alert(error))
  }

  //TODO put logic in AuthService
  function reset(email) {
    if (email) {
      Parse.User
        .requestPasswordReset(email)
        .then(() => {
          alert('A password reset email has been sent to ' + email);
          toggleLogin();
        })
        .catch(err => {
          alert(err.code + " " + err.message);
        });
    }
  }
}

angular
  .module('components.auth')
  .controller('AuthController', AuthController);
