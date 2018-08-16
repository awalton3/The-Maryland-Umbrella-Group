function UploadsController($mdSidenav, $rootScope, TutorModel) {

  var ctrl = this;
  ctrl.$onInit = function() {
    //define variables
    ctrl.user = $rootScope.currentUser;

    //define functions
    ctrl.getStudents = getStudents;

    getStudents(); // retrieves students and corresponding subjects for current user onLoad
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



}

angular
  .module('components.uploads')
  .controller('UploadsController', UploadsController);
