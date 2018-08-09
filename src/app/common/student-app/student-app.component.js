var studentApp = {
    templateUrl: './student-app.html',
    controller: 'StudentAppController'
};

angular
    .module('common')
    .component('studentApp', studentApp)
    .config(function ($stateProvider) {
        $stateProvider
            .state('student-app', {
                redirectTo: 'tutor',
                url: '/',
                data: {
                    requiredAuth: true
                },
                component: 'studentApp'
            })
    });
