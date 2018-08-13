var appSidenav = {
  templateUrl: './app-sidenav.html',
  controller: 'AppSidenavController',
  bindings: {
    user: '<'
  }
};

angular
  .module('common')
  .component('appSidenav', appSidenav);
