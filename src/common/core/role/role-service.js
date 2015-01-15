angular.module('scent.core.role', ['scent.core'])
       .constant('scent.core.role.url', '/users/:userId/role');


/**
 * @ngdoc service
 * @name scent.core.role.roleService
 * @description
 * # roleService
 * Factory in the scent.core.role.
 */
angular
    .module('scent.core.role')
    .factory('roleService', ['$resource', '_', 'baseUrl', 'scent.core.role.url', 'authCode',

        function($resource, _, baseUrl, urlTemplate, authCode) {

            'use strict';

            return $resource(
                baseUrl + urlTemplate,
                {},
                { query : { method  : 'GET',
                            headers : { 'Authorization' : 'Bearer ' + authCode },
                            isArray : true,
                            transformResponse: function (data) {
                                return angular.fromJson(data).userRoles;
                                //return _.pluck(angular.fromJson(data).user_roles, "user_role");
                            } }
                });
          }
    ]);


