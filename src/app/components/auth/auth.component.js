var auth = {
    templateUrl: './auth.html',
    controller: 'AuthController'
};

angular
    .module('components.auth')
    .component('auth', auth)
    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            // .state('auth', {
            //     redirectTo: 'auth',
            //     url: '/auth',
            //     templateUrl: './auth.html'
            // })
            .state('auth', {
                url: '/auth',
                component: 'auth'
            });
         $urlRouterProvider.otherwise('/auth');
    });
