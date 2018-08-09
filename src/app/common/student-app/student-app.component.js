var studentApp = {
  templateUrl: './student-app.html',
  controller: 'StudentAppController',
  resolve: {
    isAuthenticated: ['$q', function($q) {
      if ( /*user is not admin*/ ) {
        return $q.reject("Not Authorized");
      }
    }]
  }
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
        component: 'studentApp'
      })
  });
