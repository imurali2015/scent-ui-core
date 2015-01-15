describe('app (index):', function() {

    'use strict';

    beforeEach(module('scent.test.common'));

    describe('AppCtrl', function() {

        beforeEach(module('scentui'));

        beforeEach(inject(function(scentTestService) {
            scentTestService.initCommon.call(this);
        }));

        var AppCtrl,
            $location,
            $scope;

        beforeEach( inject( function( $controller, _$location_, $rootScope ) {
            $location = _$location_;
            $scope    = $rootScope.$new();
            AppCtrl   = $controller( 'AppCtrl', { $location: $location, $scope: $scope });
        }));

        it('should exist', inject(function() {
            expect(AppCtrl).toBeTruthy();
        }));

        it('should have user info', inject(function() {
            expect($scope.user).toBeDefined();
        }));

        it('should have first and last name as part of the user info', inject(function() {
            expect($scope.user.firstName).toBeAString();
            expect($scope.user.lastName).toBeAString();
        }));

        it('should have district info', inject(function() {
            expect($scope.district).toBeDefined();
        }));

        it('should have a name as part of the district info', inject(function() {
            expect($scope.district.name).toBeAString();
        }));
    });


    describe('top level state', function() {

        var AppCtrl,
            $scope;

        beforeEach(module('scentui',
                          function($stateProvider) {
                              $stateProvider.state('blah', {
                                  url  : '/blah',
                                  data : { pageTitle: 'blah' }
                              });
                          }));

        beforeEach(inject(function(scentTestService) {
            scentTestService.initCommon.call(this);
        }));

        beforeEach(inject(function($controller, $location, $rootScope) {

            $scope = $rootScope.$new();

            AppCtrl = $controller( 'AppCtrl', { $location: $location, $scope: $scope });
        }));

        // it('should go to home when you try to go to a nonexistent state', inject(function($state, $rootScope, $injector) {

        //     $state.go('nonexistent');
        //     $rootScope.$apply();

        //     expect($state.is('home'));
        // }));

        it('should change the page title when you go to a new state', inject(function($state, $rootScope) {

            $state.go('blah');
            $rootScope.$apply();

            expect($state.is('blah'));
            expect($scope.pageTitle = 'blah | Scholastic Central');
        }));
    });

});
