describe('student.profile:', function () {

    'use strict';

    var sunRa = {
                    //userId        : 'sunra',
                    studentId     : 'sunra',
                    firstName     : 'Sun',
                    middleInitial : 'Y',
                    lastName      : 'Ra',
                    suffix        : 'Jr',
                    grade         : '12',
                    dateOfBirth   : '5/22/14',
                    gender        : 'M'
                };

    /**
     * Tests sit right alongside the file they are testing, which is more intuitive
     * and portable than separating `src` and `test` directories. Additionally, the
     * build process will exclude all `.spec.js` files from the build
     * automatically.
     */
    describe('StudentProfileCtrl', function() {

        var StudentProfileCtrl,
            $scope,
            $location;

        beforeEach( module( 'scentui.student.profile' ) );

        beforeEach(function () {

            // simple custom matcher

            this.addMatchers({
                toBeAnArray: function () {
                    return angular.isArray(this.actual);
                },
                toBeAFunction: function () {
                    return angular.isFunction(this.actual);
                }
            });
        });


        beforeEach( inject( function( $controller, _$location_, $rootScope ) {
            $location = _$location_;
            $scope    = $rootScope.$new();
            StudentProfileCtrl = $controller( 'StudentProfileCtrl', {
                $location : $location,
                $scope    : $scope,
                profile   : sunRa
            });
        }));

        it( 'should exist', inject( function() {
            expect( StudentProfileCtrl ).toBeTruthy();
        }));

        it( 'should have student profile info', inject( function() {
            expect( $scope.studentProfile ).toBeDefined();
            expect( $scope.studentProfile.studentId ).toBe('sunra');
            expect( $scope.studentProfile.grade ).toBe('12');
        }));

        it('should contain a list of possible grades', inject(function () {
            expect($scope.grades).toBeDefined();
            expect($scope.grades).toBeAnArray();
            expect($scope.grades).toContain('K');
            expect($scope.grades).toContain('1');
            expect($scope.grades).toContain('12');
        }));

        it('should contain a list of possible genders', inject(function () {
            expect($scope.genders).toBeDefined();
            expect($scope.genders).toBeAnArray();
            expect($scope.genders).toContain('M');
            expect($scope.genders).toContain('F');
        }));

        it('should contain a function that implements to the date picker button', function() {
            expect($scope.openDatePicker).toBeDefined();
            expect($scope.openDatePicker).toBeAFunction();

            var evt = jasmine.createSpyObj('event', ['preventDefault', 'stopPropagation']);

            $scope.openDatePicker(evt);

            expect($scope.opened).toBeTruthy();
        });
    });


    /**
     * Test the ui-router state provider for this module
     */
    describe('state', function() {

        // mock the student profile service to always return our canned data

        var studentProfileService;

        beforeEach(module('scentui'));
        beforeEach(module('scentui.student'));
        beforeEach(module('scentui.student.profile',
                          function($provide) {
                              $provide.value('studentProfileService', studentProfileService = {});
                          } ));

        beforeEach( inject( function() {
            studentProfileService.query = jasmine.createSpy('query').andReturn(sunRa);
        }));


        it('should correspond to URL', inject(function($state) {
            expect($state.href('student.profile')).toEqual('#/student/profile');
        }));

        it('should load the student profile data when you go to "student.profile"', inject(function($state, $rootScope, $injector) {

            $state.go('student.profile');
            $rootScope.$apply();

            expect($state.is('student.profile'));

            expect($state.current.name).toBe('student.profile');
            expect($state.current.data.pageTitle).toBe('Student Profile');

            expect($injector.invoke($state.current.views.main.resolve.profile)).toEqual(sunRa);
        }));
    });
});
