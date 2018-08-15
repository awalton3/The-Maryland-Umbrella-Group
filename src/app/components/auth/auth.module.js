/**
 *
 * @ngdoc object
 * @name components.auth
 *
 * @requires ui.router,ngParse,ngMaterial,ngMessages
 *
 * @description
 *
 * This is the auth module. It includes login, register, and reset components for auth feature.
 *
 **/

angular
  .module('components.auth', [
    'ui.router',
    'ngParse',
    'ngMaterial',
    'ngMessages'
  ])
  .config(function(ParseProvider) {
    var MY_PARSE_APP_ID = 'uDzN7E7NYIbwdzKLUwNBtDtGfxyxrrBo3C6xGri3';
    var MY_PARSE_JS_KEY = '0VcWEWBLIwEcExM2Nz3TziSGjKiMsoU7SNjI5RPA';
    ParseProvider.initialize(MY_PARSE_APP_ID, MY_PARSE_JS_KEY);
    ParseProvider.serverURL = 'https://parseapi.back4app.com/';

  })
  .run(function($transitions, $state, AuthService, $rootScope) {
    if (Parse.User.current() !== null) {
      $rootScope.currentUser = Parse.User.current();
    }
    $transitions.onStart({
      to: function(state) {
        return !!(state.data && state.data.requiredAuth);
      }
    }, function() {
      return AuthService
        .requireAuthentication()
        .catch(function() {
          return $state.target('auth');
        });
    });
    $transitions.onStart({
      to: 'auth'
    }, function() {
      if (AuthService.isAuthenticated()) {
        if ($rootScope.currentUser.attributes.type === 'STUDENT') {
          return $state.go('student-app');
        } else {
          return $state.go('tutor-app');
        }
      }
    });
  });
