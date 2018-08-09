var student = {
  templateUrl: './student.html',
  controller: 'StudentController',
  bindings: {}
}

angular
  .module('components.student')
  .component('student', student)
  .config(function($stateProvider) {
    $stateProvider.state('student', {
      parent: 'student-app',
      url: 'student',
      component: 'student'
    })
  });
