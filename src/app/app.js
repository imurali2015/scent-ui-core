(function (angular) {

'use strict';

angular.module( 'scentui', [
    'ngResource',
    'ngAnimate',
    'ui.router',
    'templates-app',
    'templates-common',
    'scentui.home',
    'scentui.student',
    'scentui.techadmin'
])

.constant('currentUser', angular.isDefined(window.currentUser) ?
                            window.currentUser : {
                                                     userId    : 'sunra',
                                                     orgId     : 90210,
                                                     firstName : 'Sun',
                                                     lastName  : 'Ra'      })
.constant('logoutUrl', '/svc-web/logout')

.config( function AppConfig($urlRouterProvider /* , $stateProvider, logoutUrl */) {

    // $stateProvider
    //     .state('logout', {
    //         url: '/logout',
    //         onEnter: function() {
    //             console.log('logging out');
    //             window.location = logoutUrl;
    //         },
    //         controller: function($state) {
    //             $state.go('home');
    //         }
    //     });

    $urlRouterProvider
        .otherwise( '/home' );
})

.run( function run () {
})


.controller( 'AppCtrl', function AppCtrl($scope, $rootScope, $location, currentUser, logoutUrl) {

    $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
        console.log('state change error: %s %o', toState, error);
    });

    $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {

        console.log('%s%s -> %s%s', fromState.name, angular.toJson(fromParams), toState.name, angular.toJson(toParams));

        if (angular.isDefined(toState.data.pageTitle)) {
            $scope.pageTitle = toState.data.pageTitle + ' | Scholastic Central';
        }
    });

    $scope.logoutUrl = logoutUrl;
    $scope.user      = currentUser;

    $scope.district = {
        name : 'Scent 2.0'
    };
});


})(window.angular);
