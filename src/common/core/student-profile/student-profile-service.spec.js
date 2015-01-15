describe('Service:', function() {

    'use strict';

    describe('studentProfileService', function () {

        // load the service's module
        beforeEach(module('scent.core.student-profile'));

        beforeEach(function () {

            // simple custom matcher

            this.addMatchers({
                toBeAnObject: function () {
                    return angular.isObject(this.actual);
                }
            });
        });


        it('should exist', inject(function (studentProfileService) {
            expect(studentProfileService).toBeDefined();
        }));


        it('should issue a GET request when queried', inject(function (studentProfileService, $httpBackend, baseUrl) {

            $httpBackend.expectGET(baseUrl + '/students/sunra/profile')
                        .respond({
                                    //userId        : 'sunra',
                                    studentId     : 'sunra',
                                    firstName     : 'Sun',
                                    middleInitial : 'Y',
                                    lastName      : 'Ra',
                                    suffix        : 'Jr',
                                    grade         : '12',
                                    dateOfBirth   : '5/22/14',
                                    gender        : 'M'
                                 });

            var profile = studentProfileService.query({ userId : 'sunra' });

            $httpBackend.flush();

            expect(profile).toBeDefined();
            expect(profile).toBeAnObject();
            expect(profile.studentId).toBe('sunra');
            expect(profile.firstName).toBe('Sun');
            expect(profile.lastName).toBe('Ra');
        }));
    });


});
