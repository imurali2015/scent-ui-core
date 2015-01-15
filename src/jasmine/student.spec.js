describe('student:', function () {

    'use strict';

    var sunRa = {
                    userId    : 'sunra',
                    firstName : 'Sun',
                    lastName  : 'Ra'
                };

    /**
     * Tests sit right alongside the file they are testing, which is more intuitive
     * and portable than separating `src` and `test` directories. Additionally, the
     * build process will exclude all `.spec.js` files from the build
     * automatically.
     */
    describe('StudentCtrl', function() {

        var StudentCtrl,
            $scope,
            $location;

        beforeEach( module( 'scentui.student' ) );

        // beforeEach(function () {

        //     // simple custom matcher

        //     this.addMatchers({
        //         toBeAnArray: function () {
        //             return angular.isArray(this.actual);
        //         },
        //         toBeAFunction: function () {
        //             return angular.isFunction(this.actual);
        //         }
        //     });
        // });


        beforeEach( inject( function( $controller, _$location_, $rootScope ) {
            $location = _$location_;
            $scope    = $rootScope.$new();
            StudentCtrl = $controller( 'StudentCtrl', {
                $location   : $location,
                $scope      : $scope,
                currentUser : sunRa
            });
        }));

        it( 'should exist', inject( function() {
            expect( StudentCtrl ).toBeTruthy();
        }));

        it( 'should have student info', inject( function() {
            expect( $scope.user ).toBeDefined();
            expect( $scope.user.userId ).toBe('sunra');
            expect( $scope.user.firstName ).toBe('Sun');
        }));
    });


    /**
     * Test the ui-router state provider for this module
     */
    describe('state', function() {

        beforeEach( module( 'scentui.student' ) );

        it('should correspond to URL', inject(function($state) {
            expect($state.href('student')).toEqual('#/student');
        }));

        it('should contain student data when you go to "student"', inject(function($state, $rootScope) {

            $state.go('student');
            $rootScope.$apply();

            expect($state.is('student'));

            expect($state.current.name).toBe('student');
            expect($state.current.data.pageTitle).toBe('Student');
        }));
    });
});
