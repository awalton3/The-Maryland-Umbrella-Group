var tutorApp = {
    templateUrl: './tutor-app.html',
    controller: 'TutorAppController'
};

angular
    .module('common')
    .component('tutorApp', tutorApp)
    .config(function ($stateProvider) {
        $stateProvider
            .state('tutor-app', {
                redirectTo: 'tutor',
                url: '/',
                data: {
                    requiredAuth: true
                },
                component: 'tutorApp'
            })
    });
