function UploadsController($mdSidenav, $rootScope, TutorModel) {

  var ctrl = this;
  ctrl.$onInit = function() {
    //define variables
    ctrl.user = $rootScope.currentUser;

    //define functions
    ctrl.getStudents = getStudents;

    //run functions on init
    getStudents(); // retrieves students and corresponding subjects from parse for current user
  }

function getStudents() {
  return TutorModel.getByUser(ctrl.user).then(parseObject => {
    ctrl.students = parseObject[0].attributes.students;
    ctrl.subjects = parseObject[0].attributes.subjects;
  })
}



}

angular
  .module('components.uploads')
  .controller('UploadsController', UploadsController);
