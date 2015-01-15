(function (angular) {

    'use strict';

    var toDate = function (str) {
        return angular.isString(str) ? new Date(str) : str;
    };

    var transformDateStringsToFields = function (data) {

        var processes = angular.fromJson(data);

        angular.forEach(processes, function (proc) {
                                        proc.createdAt = toDate(proc.createdAt);
                                        proc.updatedAt = toDate(proc.updatedAt);
                                   });
        return processes;
    };


    angular.module('scent.core.background-process', ['scent.core', 'angularFileUpload']);

    /**
     * @ngdoc service
     * @name scent.core.background-process.backgroundProcessPerOrgService
     * @description
     * # backgroundProcessPerOrgService
     *
     * Factory in the scent.core.background-process.
     */
    angular
        .module('scent.core.background-process')
        .factory('backgroundProcessPerOrgService', function($resource, baseUrl, authCode) {

                return $resource(
                    baseUrl + '/processes/org/:orgId',
                    {},
                    { query : { method  : 'GET',
                                headers : { 'Authorization' : 'Bearer ' + authCode },
                                isArray : true,
                                transformResponse: transformDateStringsToFields }
                    });
              })
        .factory('backgroundProcessPerUserService', function($resource, baseUrl, authCode) {

                return $resource(
                    baseUrl + '/processes/user/:userId',
                    {},
                    { query : { method  : 'GET',
                                headers : { 'Authorization' : 'Bearer ' + authCode },
                                isArray : true,
                                transformResponse: transformDateStringsToFields }
                    });
              })
        .factory('backgroundProcessUploadService', function($upload, baseUrl) {
                return {
                    upload: function (userId, $files) {
                        return $upload.upload({
                                    url    : baseUrl + '/processes/user/' + userId,
                                    method : 'POST',
                                    file   : $files  // list of files to upload
                                });
                                                            // data   : {myObj: $scope.myModelObj},
                    }
                };
              });


})(window.angular);