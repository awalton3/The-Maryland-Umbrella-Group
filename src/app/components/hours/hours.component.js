var hours = {
  templateUrl: './hours.html',
  controller: 'HoursController',
  bindings: {}
}

angular
  .module('components.hours')
  .component('hours', hours)
  .config(function($stateProvider) {
    $stateProvider.state('hours', {
      parent: 'tutor-app',
      url: 'tutor/hours',
      component: 'hours'
    })
  });
