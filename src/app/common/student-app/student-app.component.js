var studentApp = {
  templateUrl: './student-app.html',
  controller: 'StudentAppController'
};

angular
  .module('common')
  .component('studentApp', studentApp)
  .config(function($stateProvider) {
    $stateProvider
      .state('student-app', {
        redirectTo: 'student',
        url: '/',
        data: {
          requiredAuth: true
        },
        component: 'studentApp',
        resolve: {
          authorization: ['$q', '$rootScope', function($q, $rootScope) {
            var deferred = $q.defer();
            if ($rootScope.currentUser !== null) {
              if ($rootScope.currentUser.attributes.type === 'STUDENT') {
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
