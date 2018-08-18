function UploadsController($rootScope, TutorModel, UploadsModel) {

  var ctrl = this;
  ctrl.$onInit = function() {
    //define variables
    ctrl.user = $rootScope.currentUser;
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

    getStudents(); // retrieves students and corresponding subjects for current user onLoad
    getUploads(); //retrieves uploads for current user onLoad
  }

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
    })
  }

}

angular
  .module('components.uploads')
  .controller('UploadsController', UploadsController);
