(function (angular) {

    'use strict';

    angular.module( 'scentui.student.profile', [
        'ui.router',
        'ui.bootstrap',
        'templates-app',
        'scent.core.student-profile'
    ])

    .config(function config( $stateProvider ) {
        $stateProvider.state( 'student.profile', {
            url: '/profile',
            views: {
                'main': {
                    controller: 'StudentProfileCtrl',
                    templateUrl: 'student/profile/student-profile.tpl.html',
                    resolve: {
                        profile: function (studentProfileService, currentUser) {
                                        return studentProfileService.query({ userId : currentUser.userId });
                                 }
                    }
                }
            },
            data:{ pageTitle: 'Student Profile' }
        });
    })

    .controller( 'StudentProfileCtrl', function StudentProfileCtrl($scope, profile) {

        $scope.studentProfile = profile; // || { grade: '1', gender: 'other'}; // studentProfileService.query({ userId : currentUser.userId });
        $scope.grades  = ['PK', 'K' , '1' , '2' , '3' , '4' , '5' , '6' , '7' , '8' , '9' , '10', '11', '12'];
        $scope.genders = ['F', 'M' , 'other'];

        $scope.openDatePicker = function($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.opened = true;
        };
    })

;})(window.angular);