(function (angular, undefined) {

    'use strict';

    angular.module('scent.core.csv-column-map', ['scent.core'])
        .constant('csvExpectedColumns', {
            students : {
                required: [
                    { name: 'Student ID',     type: 'numeric',       note: 'max. 16 digits'  },
                    { name: 'Last Name',      type: 'alphabetical',  note: 'max. 16 letters' },
                    { name: 'First Name',     type: 'alphabetical',  note: 'max. 16 letters' },
                    { name: 'Grade',          type: 'alphanumeric',  note: 'K, 1, ... 12'    }
                    ],
                optional : [
                    { name: 'Middle Initial', type: 'alphabetical',  note: 'max. 1 letter'   },
                    { name: 'Email',          type: 'email address', note: 'max. 80 characters' },
                    { name: 'Attribute 7',    type: 'numeric',       note: 'max. 16 digits'  },
                    { name: 'Attribute 8',    type: 'numeric',       note: 'max. 16 digits'  },
                    { name: 'Attribute 9',    type: 'numeric',       note: 'max. 16 digits'  }
                    ]
            },
            teachers : {
                required: [
                    { name: 'Teacher ID',     type: 'numeric',       note: 'max. 16 digits'  },
                    { name: 'Last Name',      type: 'alphabetical',  note: 'max. 16 letters' },
                    { name: 'First Name',     type: 'alphabetical',  note: 'max. 16 letters' }
                    ],
                optional : [
                    { name: 'Middle Initial', type: 'alphabetical',  note: 'max. 1 letter'   },
                    { name: 'Email',          type: 'email address', note: 'max. 80 characters' },
                    { name: 'Attribute 6',    type: 'numeric',       note: 'max. 16 digits'  },
                    { name: 'Attribute 7',    type: 'numeric',       note: 'max. 16 digits'  },
                    { name: 'Attribute 8',    type: 'numeric',       note: 'max. 16 digits'  },
                    { name: 'Attribute 9',    type: 'numeric',       note: 'max. 16 digits'  }
                    ]
            },
            classes : {
                required: [
                    { name: 'Class ID',       type: 'numeric',       note: 'max. 16 digits'  },
                    { name: 'Name',           type: 'alphabetical',  note: 'max. 16 letters' }
                    ],
                optional : [
                    { name: 'Attribute 3',    type: 'numeric',       note: 'max. 16 digits'  },
                    { name: 'Attribute 4',    type: 'numeric',       note: 'max. 16 digits'  },
                    { name: 'Attribute 5',    type: 'numeric',       note: 'max. 16 digits'  }
                    ]
            }
        });

    // when does the bg process get created?  upon file upload?  if we need a column mapping step,
    //    do we need a separate stage here?  file uploaded but not ready to import yet?


    /**
     * @ngdoc service
     * @name scent.core.csv-column-map.csvColumnMapService
     * @description
     * # csvColumnMapService
     *
     * Factory in the scent.core.csv-column-map.
     */
    angular
        .module('scent.core.csv-column-map')
        .factory('csvColumnMapService', function($resource, baseUrl, authCode) {

                return $resource(
                    baseUrl + '/csvImports/:processId/columnMap',
                    {},
                    { query : { method  : 'GET',
                                headers : { 'Authorization' : 'Bearer ' + authCode } }
                    });
              });

})(window.angular);
