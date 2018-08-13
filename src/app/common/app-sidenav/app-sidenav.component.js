var appSidenav = {
  templateUrl: './app-sidenav.html',
  bindings: {
    user: '<'
  }
};

angular
  .module('common')
  .component('appSidenav', appSidenav);
