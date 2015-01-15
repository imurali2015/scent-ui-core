describe('Service:', function() {

    'use strict';

    describe('roleService', function () {

        // var roleService,
        //     $httpBackend;

        // load the service's module
        beforeEach(module('scent.core.role'));

        // instantiate service
        // beforeEach(inject(function (_roleService_, _$httpBackend_) {
        //     roleService  = _roleService_;
        //     $httpBackend = _$httpBackend_;
        // }));

        beforeEach(function () {

            // simple custom matcher

            this.addMatchers({
                toBeAnArray: function () {
                    return angular.isArray(this.actual);
                }
            });
        });


        it('should exist', inject(function (roleService) {
            expect(roleService).toBeDefined();
        }));


        it('should issue a GET request when queried', inject(function (roleService, $httpBackend, baseUrl) {

            $httpBackend.expectGET(baseUrl + '/users/sunra/role')
                        .respond({
                                      userRoles: ['Student', 'Teacher']
                                 });

            var roles = roleService.query({ userId : 'sunra' });

            $httpBackend.flush();

            expect(roles).toBeDefined();
            expect(roles).toBeAnArray();
            expect(roles.length).toBe(2);
            expect(roles).toContain('Student');
            expect(roles).toContain('Teacher');
        }));
    });


});
