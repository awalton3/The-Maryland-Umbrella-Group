function UploadsController($mdSidenav, $rootScope, TutorModel) {

  var ctrl = this;
  ctrl.$onInit = function() {
    //define variables
    ctrl.user = $rootScope.currentUser;

    //define functions
    ctrl.getStudents = getStudents;
    getStudents();

  }

function getStudents() {
  return TutorModel.getByUser(ctrl.user).then(parseObject => {
    console.log("STUDENTS: ", parseObject[0].attributes.students);
    console.log("Subjects: ", parseObject[0].attributes.subjects);
  })
}



}

angular
  .module('components.uploads')
  .controller('UploadsController', UploadsController);
