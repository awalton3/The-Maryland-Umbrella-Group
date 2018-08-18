function UploaderController($mdSidenav, $rootScope, $scope, UploadsModel) {
  var ctrl = this;
  ctrl.$onInit = function() {
    //define variables
    ctrl.user = $rootScope.currentUser;
    ctrl.toggleUploader = buildToggler('uploader');
    ctrl.upload = {
      firstname: '',
      lastname: '',
      subject: '',
      instructions: '',
      comments: ''
    };

    //define functions
    ctrl.buildToggler = buildToggler;
    ctrl.closeUploader = closeUploader;
    ctrl.clearForm = clearForm;
    ctrl.submitUpload = submitUpload;
  }

  ctrl.$onChanges = function(changes) {
    if (changes.upload) {
      ctrl.upload = angular.copy(ctrl.upload);
    }
  };

  function buildToggler(componentId) {
    console.log(componentId)
    return function() {
      $mdSidenav(componentId).toggle();
    };
  }

  function closeUploader() {

    if ($scope.uploadForm.$dirty) {
      let alert = window.confirm("Closing this window will delete all form inputs. Are you sure you would like to close the uploader?");
      if (alert) {
        ctrl.toggleUploader();
        clearForm();
      }
    } else {
      ctrl.toggleUploader();
      clearForm();
    }
  }

  function submitUpload(uploadObject) {
    return Promise.resolve(UploadsModel.New())
      .then(newUpload => {
        newUpload.set('firstname', uploadObject.firstname);
        newUpload.set('lastname', uploadObject.lastname);
        newUpload.set('subject', uploadObject.subject);
        newUpload.set('instructions', uploadObject.instructions);
        newUpload.set('comments', uploadObject.comments);
        newUpload.set('tutor', ctrl.user);
        newUpload.save()
          .then(newUpload => {
            Promise.resolve(alert('Your upload for ' + uploadObject.firstname + ' ' + uploadObject.lastname + ' has been submitted.'))
            clearForm();
            ctrl.toggleUploader();
            // getUploads();
          }).catch(error => console.log(error))
      }).catch(error => alert(error))
  };

  function clearForm() {
    ctrl.upload = {};
    $scope.uploadForm.$setPristine();
    $scope.uploadForm.$setUntouched();
  }


}

angular
  .module('components.uploads')
  .controller('UploaderController', UploaderController);
