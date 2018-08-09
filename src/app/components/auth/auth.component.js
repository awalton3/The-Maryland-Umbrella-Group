var auth = {
    templateUrl: './auth.html',
    controller: 'AuthController'
};

angular
    .module('components.auth')
    .component('auth', auth)
    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('auth', {
                url: '/auth',
                component: 'auth'
            });
         $urlRouterProvider.otherwise('/auth');
    });
