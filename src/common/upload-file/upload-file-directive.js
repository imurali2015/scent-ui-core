(function (angular, undefined) {

    'use strict';

    /**
     * @ngdoc directive
     * @name uploadFile.directive:uploadFile
     * @description
     * # uploadFile
     */
    angular
        .module('scent.uploadFile', [
            'scent.core.background-process',
            'templates-common'
        ])
        .directive('uploadFile', function() {

            return {
                restrict    : 'AE',
                replace     : false,
                templateUrl : 'upload-file/upload-file-directive.tpl.html',
                scope       : {
                    fileType  : '=type',
                    successFn : '=success',
                    errorFn   : '=error'
                },
                controller  : function ($scope, backgroundProcessUploadService, currentUser, $timeout) {

                    $scope.percentage  = 0;
                    $scope.max         = 100;
                    $scope.uploadCount = 0;
                    //$scope.file       = undefined;

                    $scope.uploadInProgress = function () {
                        return $scope.percentage > 0;
                    };

                    $scope.onFileSelect = function ($files) {
                        $scope.file = $files && $files[0];      // we only support single files for now

                        // console.log($files);

                        $scope.upload = backgroundProcessUploadService
                                            .upload(currentUser.userId, $files)
                                            .progress(function(evt) {

                                                $scope.percentage = Math.round(100.0 * evt.loaded / evt.total);

                                                console.log('%s: %d%%', $scope.file.name, $scope.percentage);
                                            })
                                            .success(function(data /*status, headers, config*/) {

                                                var args = arguments;

                                                // file is uploaded successfully
                                                console.log('upload success!', data);

                                                $timeout(function () {

                                                    // console.log('success');

                                                    $scope.percentage   = 0;
                                                    $scope.uploadCount += 1;

                                                    if ($scope.successFn) {
                                                        $scope.successFn.apply($scope, [].concat.apply([$scope.fileType], args));
                                                    }
                                                    //$scope.$apply($scope.success);

                                                }, 1000);
                                            })
                                            .error(function(/*data, status, headers, config*/) {

                                                var args = arguments;

                                                console.log('upload failed!', arguments);

                                                $timeout(function () {

                                                    $scope.percentage = 0;
                                                    if ($scope.errorFn) {
                                                        $scope.errorFn.apply($scope, [].concat.apply([$scope.fileType], args));
                                                    }
                                                    //$scope.$apply($scope.error);

                                                }, 1000);
                                            });
                    };

                    // console.log('upload File controller', $scope);
                }
                // link: function() {
                //     // console.log(scope, element, attrs);
                // }
            };
        });

})(window.angular);
