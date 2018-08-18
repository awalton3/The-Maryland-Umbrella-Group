var uploader = {
  templateUrl: './uploader.html',
  controller: 'UploaderController',
  bindings: {
    
  }
}

angular
  .module('components.uploads')
  .component('uploader', uploader);
