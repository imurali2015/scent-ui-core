(function (angular) {

    'use strict';

    angular.module( 'scentui.techadmin', [
        'ui.router',
        'LocalStorageModule',
        'templates-app',
        'scentui.techadmin.importcsv',
        'scentui.techadmin.importcsv.fixerrors',
        'scent.core.background-process'
    ])

    .config(function config($stateProvider, localStorageServiceProvider) {

        $stateProvider.state( 'techadmin', {
            url: '/techadmin',
            views: {
                'main': {
                    controller: 'TechAdminCtrl',
                    templateUrl: 'techadmin/techadmin.tpl.html',
                    resolve: {
                        processes: function (backgroundProcessPerOrgService, currentUser) {
                                       return backgroundProcessPerOrgService.query({ orgId : currentUser.orgId });
                                   }
                    }
                }
            },
            data: { pageTitle: 'Tech Admin' }
        });

        localStorageServiceProvider
            .setPrefix('scentui.techadmin')
            .setStorageType('sessionStorage');

    })

    .controller( 'TechAdminCtrl', function TechAdminCtrl($scope, currentUser, $state, processes) {

        // console.log($state.get && $state.get());
        // console.log($state.current);

        $scope.user          = currentUser;
        $scope.schoolName    = 'George Kennedy Middle School';
        $scope.appSpaceTitle = $state.current.data.pageTitle;

        //--- import job list

        $scope.processes = processes;


        //--- job list dropdown

        $scope.dropDownStatus = { isopen: false };

        // $scope.toggled = function(open) {
        //     console.log('Dropdown is now: ', open);
        // };

        $scope.toggleDropdown = function($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.dropDownStatus.isopen = !$scope.dropDownStatus.isopen;
        };
    })

;})(window.angular);
