/**
 * @ngdoc service
 * @name components.auth:AuthService
 *
 * @description Handles authentication for app
 */

function AuthService(Parse, $state, $rootScope, StudentModel, TutorModel) {
  var auth = new Parse.User(); // creates a new user in Parse
  var currentUser = null; //holds info about current user

  /**
   * @ngdoc method
   * @name AuthService#storeAuthData
   * @methodOf components.auth:AuthService
   * @param {object} obj Parse user object
   * @returns {object} returns currentUser object
   */

  function storeAuthData(response) {
    currentUser = response;
    return currentUser;
  }

  /**
   * @ngdoc method
   * @name AuthService#clearAuthData
   * @methodOf components.auth:AuthService
   * @returns {object} returns a blank user object
   */

  function clearAuthData() {
    currentUser = Parse.User.current(); // this will now be null
    return currentUser;
  }

  /**
   * @ngdoc method
   * @name AuthService#login
   * @methodOf components.auth:AuthService
   * @param {object} obj user data from auth-form
   * @returns {object} returns the current user object
   */

  this.login = function(user) {
    let userType = user.type
    return Parse.User
      .logIn(user.email, user.password)
      .then(user => {
        if (user.attributes.emailVerified && user.attributes.type === userType) {
          storeAuthData()
          $rootScope.currentUser = user;
          if (userType === 'STUDENT') {
            $state.go('student-app');
          } else {
            $state.go('tutor-app');
          }
        } else {
          this.logout()
            .then(() => {
              alert('Please verify email address or ensure you are logging in as the correct user type.');
            })
        }
      })
      .catch(error => alert(error))
  };

  /**
   * @ngdoc method
   * @name AuthService#register
   * @methodOf components.auth:AuthService
   * @param {object} obj user data from auth-form
   * @returns {object} returns the current user object
   */

  this.register = function(user) {
    auth.set("username", user.email);
    auth.set("firstname", user.firstname);
    auth.set("lastname", user.lastname);
    auth.set("password", user.password);
    auth.set("email", user.email);
    auth.set("type", user.type)
    return auth

  };

  /**
   * @ngdoc method
   * @name AuthService#addByType
   * @methodOf components.auth:AuthService
   * @param {object} obj user data from auth-form
   * @returns {object} returns the new user object and uploads to corresponding parse class
   */

  this.addByType = function(user) {
    console.log(user);
    if (user.attributes.type === 'STUDENT') {
      return StudentModel.New()
        .then(newStudentObject => {
          newStudentObject.set("user", user);
          newStudentObject.save()
            .then(newStudentObject => {
              Promise.resolve();
            }).catch(error => console.log(error))
        })
    } else if (user.attributes.type === 'TUTOR') {
      return TutorModel.New()
        .then(newTutorObject => {
          newTutorObject.set('user', user);
          newTutorObject.save()
            .then(newTutorObject => {
              Promise.resolve();
            }).catch(error => console.log(error))
        })
    }
  }

  /**
   * @ngdoc method
   * @name AuthService#logout
   * @methodOf components.auth:AuthService
   * @returns {object} returns an empty user object
   */

  this.logout = function() {
    return Parse.User.logOut()
      .then(clearAuthData);
  };

  /**
   * @ngdoc method
   * @name AuthService#requireAuthentication
   * @methodOf components.auth:AuthService
   * @returns {promise} returns resolve or reject based on user authentication
   */

  this.requireAuthentication = function() {
    return new Promise(function(resolve, reject) {
      if (!!Parse.User.current() && Parse.User.current()
        .authenticated()) {
        resolve();
      } else {
        reject();
      }
    });
  }

  /**
   * @ngdoc method
   * @name AuthService#isAuthenticated
   * @methodOf components.auth:AuthService
   * @returns {boolean} returns whether user is authenticated based on sessionStorage
   */

  this.isAuthenticated = function() {
    return !!(Parse.User.current() && Parse.User.current()
      .authenticated());
  };

  /**
   * @ngdoc method
   * @name AuthService#getUser
   * @methodOf components.auth:AuthService
   * @returns {object} returns currentUser sessionStorage object
   */

  this.getUser = function() {
    if (auth) {
      return auth;
    }
  };

};

angular
  .module('components.auth')
  .service('AuthService', AuthService);
