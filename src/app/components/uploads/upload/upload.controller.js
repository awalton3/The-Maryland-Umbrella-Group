function UploadController() {

  var ctrl = this;
  ctrl.$onInit = function() {

    //define functions
    ctrl.getInitials = getInitials;
    ctrl.convertDate = convertDate;
    getInitials()
    convertDate()
  }

  function getInitials() {
    let fullName = ctrl.name;
    let matches = fullName.match(/\b(\w)/g);
    ctrl.initials = matches.join('.');
  }

  function convertDate() {
    ctrl.date = JSON.stringify(ctrl.createdAt);
    console.log(ctrl.date)
  }

}

angular
  .module('components.uploads')
  .controller('UploadController', UploadController);
