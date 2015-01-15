describe('Service:', function() {

    'use strict';

    var importJobs = [
          {
            "id"              : 32,
            "orgId"           : 90210,
            "userId"          : "sunra",
            "processToken"    : "f5fb4e39-7e4b-480b-9ce1-440b77a95ff5",
            "filename"        : "nyc_teachers.csv",
            "status"          : "completed",
            "createdAt"       : "Mon Nov 10 2014 09:20:33 GMT-0500 (EST)",
            "updatedAt"       : "Mon Nov 10 2014 13:20:45 GMT-0500 (EST)",
            "percentComplete" : 100
          },
          {
            "id"              : 33,
            "orgId"           : 90210,
            "userId"          : "sunra",
            "processToken"    : "f5fb4e39-7e4b-480b-9ce1-440b77a95ff6",
            "filename"        : "nyc_students.csv",
            "status"          : "validating",
            "createdAt"       : "Mon Nov 10 2014 09:45:26 GMT-0500 (EST)",
            "updatedAt"       : "Mon Nov 10 2014 13:20:45 GMT-0500 (EST)",
            "percentComplete" : 50
          }];

    var csvFile = [{
            "webkitRelativePath" : "",
            "lastModified"       : 1415915294000,
            "lastModifiedDate"   : "2014-11-13T21:48:14.000Z",
            "name"               : "is_interested_in.csv",
            "type"               : "text/csv",
            "size"               : 208409037
        }];


    describe('scent.core.background-process', function () {

        // load the service's module
        beforeEach(module('scent.core.background-process'));

        beforeEach(function () {

            // simple custom matcher

            this.addMatchers({
                toBeAnObject: function () {
                    return angular.isObject(this.actual);
                },
                toBeAnArray: function () {
                    return angular.isArray(this.actual);
                }
            });
        });


        describe('backgroundProcessPerOrgService', function () {

            it('should exist', inject(function (backgroundProcessPerOrgService) {
                expect(backgroundProcessPerOrgService).toBeDefined();
            }));


            it('should issue a GET request when queried', inject(function (backgroundProcessPerOrgService, $httpBackend, baseUrl) {

                $httpBackend.expectGET(baseUrl + '/processes/org/90210')
                            .respond(importJobs);

                var jobs = backgroundProcessPerOrgService.query({ orgId : 90210 });

                $httpBackend.flush();

                expect(jobs).toBeDefined();
                expect(jobs).toBeAnArray();
                expect(jobs.length).toBe(2);
            }));
        });


        describe('backgroundProcessPerUserService', function () {

            it('should exist', inject(function (backgroundProcessPerUserService) {
                expect(backgroundProcessPerUserService).toBeDefined();
            }));


            it('should issue a GET request when queried', inject(function (backgroundProcessPerUserService, $httpBackend, baseUrl) {

                $httpBackend.expectGET(baseUrl + '/processes/user/sunra')
                            .respond(importJobs);

                var jobs = backgroundProcessPerUserService.query({ userId : 'sunra' });

                $httpBackend.flush();

                expect(jobs).toBeDefined();
                expect(jobs).toBeAnArray();
                expect(jobs.length).toBe(2);
            }));
        });


        describe('backgroundProcess object', function () {

            it('should always contain dates for createdAt and updatedAt', inject(function (backgroundProcessPerOrgService, $httpBackend, baseUrl) {

                $httpBackend.expectGET(baseUrl + '/processes/org/90210')
                            .respond(importJobs);

                var jobs = backgroundProcessPerOrgService.query({ orgId : 90210 });

                $httpBackend.flush();

                expect(jobs[0].createdAt).toBeDefined();
                expect(jobs[0].updatedAt).toBeDefined();

                expect(jobs[0].createdAt).toEqual(jasmine.any(Date));
                expect(jobs[0].updatedAt).toEqual(jasmine.any(Date));

                expect(jobs[1].createdAt).toBeDefined();
                expect(jobs[1].updatedAt).toBeDefined();

                expect(jobs[1].createdAt).toEqual(jasmine.any(Date));
                expect(jobs[1].updatedAt).toEqual(jasmine.any(Date));
            }));
        });


        describe('backgroundProcessUploadService', function () {

            it('should exist', inject(function (backgroundProcessUploadService) {
                expect(backgroundProcessUploadService).toBeDefined();
            }));


            describe('upload', function () {

                var promise;
                var result;
                var httpStatus;

                beforeEach(inject(function (backgroundProcessUploadService, $httpBackend, baseUrl) {

                    $httpBackend.expectPOST(baseUrl + '/processes/user/sunra')
                                .respond(importJobs[0]);

                    promise = backgroundProcessUploadService.upload('sunra', csvFile);

                    promise.success(function (data, status) {
                        result    = data;
                        httpStatus = status;

                        // console.log(arguments);
                    });

                    $httpBackend.flush();
                }));

                it('should issue a POST request and return a promise', function () {

                    expect(promise).toBeDefined();
                });

                it('should return a promise', function () {

                    expect(promise).toBeAnObject();
                    expect(promise.success).toBeDefined();
                });

                it('should return a result', function () {

                    expect(result).toBeAnObject();
                    expect(result).toEqual(importJobs[0]);
                });

                it('should have HTTP status success', function () {

                    expect(httpStatus).toEqual(200);
                });
            });

        });
    });

});
