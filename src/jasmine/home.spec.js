/**
 * Tests sit right alongside the file they are testing, which is more intuitive
 * and portable than separating `src` and `test` directories. Additionally, the
 * build process will exclude all `.spec.js` files from the build
 * automatically.
 */
describe('home:', function () {

    'use strict';


    var userRoles = ['Parent', 'Teacher', 'Student'];


    /**
     * Test the controller for this module
     */
    describe('HomeCtrl', function() {

        var HomeCtrl,
            $scope,
            $location;

        beforeEach(module('scentui.home'));
        beforeEach(module('scentui.student'));

        beforeEach( inject( function( $controller, _$location_, $rootScope ) {

            $location = _$location_;
            $scope    = $rootScope.$new();

            HomeCtrl  = $controller( 'HomeCtrl', {
                $location : $location,
                $scope    : $scope,
                roles     : userRoles });
        }));


        beforeEach(function () {

            this.addMatchers({
                toHaveProperty: function (property) {
                    return angular.isDefined(this.actual[property]);
                }
            });
        });


        it( 'should exist', inject( function() {
            expect( HomeCtrl ).toBeTruthy();
        }));

        it( 'should have user info', inject( function() {
            expect( $scope.user ).toBeDefined();
        }));

        it( 'should have user info specifying the user ID', inject( function() {
            expect( $scope.user.userId ).toBeDefined();
        }));

        it( 'should publish the user info for the current user', inject( function(currentUser) {
            expect( $scope.user ).toBe(currentUser);
        }));

        it( 'should have a list of user roles', inject( function() {
            expect( $scope.userRoles ).toBeDefined();
        }));

        it( 'should have Student as one of its user roles', inject( function() {
            expect( $scope.userRoles ).toContain('Student');
        }));

        it( 'should have a list of transitions', inject( function() {
            expect( $scope.transitions ).toBeDefined();
        }));

        it( 'should have student as one of its transitions', inject( function(_) {
            var names = _.pluck($scope.transitions, 'name');
            expect(_.contains(names, 'Student'));

            var student = _.find($scope.transitions, function (transition) {
                return transition.name === 'Student';
            });

            expect(student.name).toBe('Student');
            expect(student.enabled).toBe(true);
        }));
    });



    /**
     * Test the ui-router state provider for this module
     */
    describe('state', function() {

        // mock the role service to always return our canned data

        var roleService;

        beforeEach(module('scentui.home',
                          function($provide) {
                              $provide.value('roleService', roleService = {});
                          } ));

        // beforeEach( inject( function() {
        //     roleService.query = jasmine.createSpy('query').andReturn(userRoles);
        // }));


        it('should correspond to URL', inject(function($state) {
            expect($state.href('home')).toEqual('#/home');
        }));

        // it('should load the role data when you go to "home"', inject(function($state, $rootScope, $injector) {

        //     roleService.query = jasmine.createSpy('query').andReturn(userRoles);

        //     $state.go('home');
        //     $rootScope.$apply();

        //     expect($state.is('home'));

        //     expect($state.current.name).toBe('home');
        //     expect($state.current.data.pageTitle).toBe('Home');

        //     expect($injector.invoke($state.current.views.main.resolve.roles)).toEqual(userRoles);
        // }));

        // it('should use the role promise when you go to "home"', inject(function($q, $state, $rootScope, $injector) {

        //     var defer = $q.defer();

        //     roleService.query = jasmine.createSpy('query').andReturn(defer.promise);

        //     defer.resolve(userRoles);

        //     $state.go('home');
        //     $rootScope.$apply();


        //     expect($state.is('home'));

        //     expect($state.current.name).toBe('home');
        //     expect($state.current.data.pageTitle).toBe('Home');

        //     // expect($injector.invoke($state.current.views.main.resolve.roles)).toEqual(userRoles);
        // }));
    });
});
