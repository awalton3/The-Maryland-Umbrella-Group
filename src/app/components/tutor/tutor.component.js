var tutor = {
  templateUrl: './tutor.html',
  controller: 'TutorController',
  bindings: {}
}

angular
  .module('components.tutor')
  .component('tutor', tutor)
  .config(function($stateProvider) {
    $stateProvider.state('tutor', {
      parent: 'tutor-app',
      url: 'tutor',
      component: 'tutor'
    })
  });
