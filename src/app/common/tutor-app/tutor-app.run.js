function init($rootScope, $uiRouter, $mdSidenav) {
    var Visualizer = window['ui-router-visualizer'].Visualizer;
    var pluginInstance = $uiRouter.plugin(Visualizer);

    $rootScope.toggleMenu = toggleMenu;

    function toggleMenu(navId) {
        console.log('toggle sidenav: ' + navId);
        $mdSidenav(navId)
            .toggle();
    }
}

angular
    .module('common')
    .run(init)
