var studentCard = {
  templateUrl: './student-card.html',
  controller: 'StudentCardController',
  bindings: {
    name: '@',
    subject: '@',
    initials: '<'
  }
}

angular
  .module('components.uploads')
  .component('studentCard', studentCard);
