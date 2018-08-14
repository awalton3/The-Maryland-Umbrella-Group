var appNav = {
  templateUrl: './app-nav.html',
  controller: 'AppNavController',
  bindings: {
    title: '@',
    leftIcon: '@',
    rightIcon: '@'
  }
}

angular
  .module('common')
  .component('appNav', appNav);
