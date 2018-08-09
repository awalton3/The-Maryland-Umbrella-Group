var tutorApp = {
  templateUrl: './tutor-app.html',
  controller: 'TutorAppController'
};

angular
  .module('common')
  .component('tutorApp', tutorApp)
  .config(function($stateProvider) {
    $stateProvider
      .state('tutor-app', {
        redirectTo: 'tutor',
        url: '/',
        data: {
          requiredAuth: true
        },
        component: 'tutorApp',
        resolve: {
          authenticated: ['$q', '$rootScope', function($q, $rootScope) {
            var deferred = $q.defer();
            if ($rootScope.currentUser.attributes.type === 'TUTOR') {
              deferred.resolve();
            } else {
              deferred.reject('You are not authorized to visit this page');
            }
            return deferred.promise;
          }]
        }
      })
  });
