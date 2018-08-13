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
        redirectTo: 'uploads',
        url: '/',
        data: {
          requiredAuth: true
        },
        component: 'tutorApp',
        resolve: {
          authorization: ['$q', '$rootScope', function($q, $rootScope) {
            var deferred = $q.defer();
            if ($rootScope.currentUser !== null) {
              if ($rootScope.currentUser.attributes.type === 'TUTOR') {
                deferred.resolve();
              } else {
                deferred.reject('You are not authorized to visit this page');
              }
            } else {
              deferred.resolve();
            }
            return deferred.promise;
          }]
        }
      })
  });
