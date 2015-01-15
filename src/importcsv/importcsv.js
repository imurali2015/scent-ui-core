(function (angular) {

    'use strict';

    angular.module( 'scentui.techadmin.importcsv', [
        'ui.router',
        'templates-app',
        'scentui.techadmin.importcsv.upload',
        'scentui.techadmin.importcsv.mapcolumns',
        'scentui.techadmin.importcsv.fixerrors',
        'scentui.techadmin.importcsv.importing'
    ])

    .config(function config($stateProvider) {

        $stateProvider.state( 'techadmin.importcsv', {
            url         : '/importcsv',
            controller  : function ($scope, $state) {
                                $scope.appSpaceTitle = $state.current.data.pageTitle;
                                // $state.go('techadmin.importcsv.upload');
                            },
            templateUrl : 'techadmin/importcsv/importcsv.tpl.html',
            data        : { pageTitle: 'Import Roster CSV' }
        });
    })

;})(window.angular);
