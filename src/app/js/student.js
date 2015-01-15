(function (angular) {

    'use strict';

    angular.module( 'scentui.student', [
        'ui.router',
        'templates-app',
        'scentui.student.profile'
    ])

    .config(function config( $stateProvider ) {
        $stateProvider.state( 'student', {
            url: '/student',
            views: {
                'main': {
                    controller: 'StudentCtrl',
                    templateUrl: 'student/student.tpl.html'
                }
            },
            data:{ pageTitle: 'Student' }
        });
    })

    .controller( 'StudentCtrl', function StudentCtrl($scope, currentUser) {
        $scope.user = currentUser;
    })

;})(window.angular);