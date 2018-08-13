var uploads = {
  templateUrl: './uploads.html',
  controller: 'UploadsController',
  bindings: {}
}

angular
  .module('components.uploads')
  .component('uploads', uploads)
  .config(function($stateProvider) {
    $stateProvider.state('uploads', {
      parent: 'tutor-app',
      url: 'tutor/uploads',
      component: 'uploads'
    })
  });
