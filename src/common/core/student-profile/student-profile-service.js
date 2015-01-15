angular.module('scent.core.student-profile', ['scent.core'])
       .constant('scent.core.student-profile.url', '/students/:userId/profile');


/**
 * @ngdoc service
 * @name scent.core.student-profile.studentProfileService
 * @description
 * # studentProfileService
 * Factory in the scent.core.student-profile.
 */
angular
    .module('scent.core.student-profile')
    .factory('studentProfileService', ['$resource', 'baseUrl', 'scent.core.student-profile.url', 'authCode',

        function($resource, baseUrl, urlTemplate, authCode) {

            'use strict';

            return $resource(
                baseUrl + urlTemplate,
                {},
                { query : { method  : 'GET',
                            headers : { 'Authorization' : 'Bearer ' + authCode } }
                });
          }
    ]);


