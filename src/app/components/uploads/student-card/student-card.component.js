var studentCard = {
  templateUrl: './student-card.html',
  controller: 'StudentCardController',
  bindings: {
    name: '@',
    subject: '@'
  }
}

angular
  .module('components.uploads')
  .component('studentCard', studentCard);
