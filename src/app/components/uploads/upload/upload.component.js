var upload = {
  templateUrl: './upload.html',
  controller: 'UploadController',
  bindings: {
    name: '@',
    subject: '@',
    assignment: '@',
    comments: '@',
    createdAt: '<'
  }
}

angular
  .module('components.uploads')
  .component('upload', upload);
