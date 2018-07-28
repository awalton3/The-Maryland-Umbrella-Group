var memos = {
    templateUrl: './memos.html',
    controller: 'MemosController',
    bindings: {}
}

angular
    .module('components.memos')
    .component('memos', memos)
    .config(function ($stateProvider) {
        $stateProvider.state('memos', {
            parent: 'app',
            url: 'memos',
            component: 'memos'
        })
    });
