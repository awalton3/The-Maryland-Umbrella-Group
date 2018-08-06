/**
 * @ngdoc service
 * @name components.auth:AuthService
 *
 * @description Handles authentication for app
 */

function AuthService(Parse) {
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

    this.login = function (user) {
        return Parse.User
            .logIn(user.email, user.password, {
                success: function (auth) {},
                error: function (auth, error) {
                    console.log(error);
                }
            })
            .then(storeAuthData)
            .then((currentUser) => {
                sessionStorage.setItem('currentUser', currentUser)
            });

    };

    /**
     * @ngdoc method
     * @name AuthService#register
     * @methodOf components.auth:AuthService
     * @param {object} obj user data from auth-form
     * @returns {object} returns the current user object
     */

    this.register = function (user) {
        //console.log("User: ", user);
        auth.set("username", user.email);
        auth.set("firstname", user.firstname);
        auth.set("lastname", user.lastname);
        auth.set("password", user.password);
        auth.set("email", user.email);
        auth.set("type", user.type)
        return auth
            .signUp(null, {
                success: function (auth) {},
                error: function (auth, error) {
                    alert("Error: " + error.code + " " + error.message);
                }
            })
            .then(storeAuthData);
    };

    /**
     * @ngdoc method
     * @name AuthService#logout
     * @methodOf components.auth:AuthService
     * @returns {object} returns an empty user object
     */

    this.logout = function () {
        return Parse.User.logOut()
            .then(clearAuthData);
    };

    /**
     * @ngdoc method
     * @name AuthService#requireAuthentication
     * @methodOf components.auth:AuthService
     * @returns {promise} returns resolve or reject based on user authentication
     */

    this.requireAuthentication = function () {
        return new Promise(function (resolve, reject) {
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

    this.isAuthenticated = function () {
        // return !!(Parse.User.current() && Parse.User.current()
        //     .authenticated());
    };

    /**
     * @ngdoc method
     * @name AuthService#getUser
     * @methodOf components.auth:AuthService
     * @returns {object} returns currentUser sessionStorage object
     */

    this.getUser = function () {
        if (auth) {
            return auth;
        }
    };
};

angular
    .module('components.auth')
    .service('AuthService', AuthService);
