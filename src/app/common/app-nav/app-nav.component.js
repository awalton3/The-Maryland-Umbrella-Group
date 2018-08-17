var appNav = {
  templateUrl: './app-nav.html',
  controller: 'AppNavController',
  bindings: {
    title: '@',
    leftIcon: '@',
    rightIcon: '@',
    toolbarStyle: '@',
    iconColor: '@'
  }
}

angular
  .module('common')
  .component('appNav', appNav);
