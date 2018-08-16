function UploadsController($mdSidenav, $rootScope, TutorModel, UploadsModel, $scope) {

  var ctrl = this;
  ctrl.$onInit = function() {
    //define variables
    ctrl.user = $rootScope.currentUser;
    console.log(ctrl.user)
    ctrl.toggleUploader = buildToggler('uploader');
    ctrl.upload = {
      firstname: '',
      lastname: '',
      subject: '',
      instructions: '',
      comments: ''
    };
    //define functions
    ctrl.getStudents = getStudents;
    ctrl.getUploads = getUploads;
    ctrl.buildToggler = buildToggler;
    ctrl.submitUpload = submitUpload;
    ctrl.clearForm = clearForm;
    ctrl.closeUploader = closeUploader;

    getStudents(); // retrieves students and corresponding subjects for current user onLoad
    getUploads(); //retrieves uploads for current user onLoad
  }

  ctrl.$onChanges = function(changes) {
    if (changes.upload) {
      console.log(changes.upload);
      ctrl.upload = angular.copy(ctrl.upload);
    }
  };

  function getStudents() {
    return TutorModel.getByUser(ctrl.user).then(parseObject => {
      ctrl.students = parseObject[0].attributes.students;
      ctrl.subjects = parseObject[0].attributes.subjects;
      ctrl.initialsArray = [];

      for (let student = 0; student < ctrl.students.length; student++) {
        let fullName = ctrl.students[student];
        let matches = fullName.match(/\b(\w)/g);
        let initials = matches.join('.');
        ctrl.initialsArray.push(initials)
      }

    })
  }

  function getUploads() {
    return UploadsModel.getByUser(ctrl.user).then(parseObject => {
      ctrl.uploadsParseObject = [];
      ctrl.uploadsParseObject.push(parseObject);
      ctrl.uploads = ctrl.uploadsParseObject[0];
      console.log(ctrl.uploads);
    })
  }

  function buildToggler(componentId) {
    console.log(componentId)
    return function() {
      $mdSidenav(componentId).toggle();
    };
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
            Promise.resolve(console.log(newUpload.id))
            clearForm();
          }).catch(error => console.log(error))
      }).catch(error => alert(error))
  };

  function clearForm() {
    ctrl.upload = {};
    $scope.uploadForm.$setPristine();
    $scope.uploadForm.$setUntouched();
  }

  function closeUploader() {
    let alert = window.confirm("Closing this window will delete all form inputs. Are you sure you would like to close the uploader?");
    if (alert) {
      ctrl.toggleUploader();
      clearForm();
    }
  }

}

angular
  .module('components.uploads')
  .controller('UploadsController', UploadsController);
