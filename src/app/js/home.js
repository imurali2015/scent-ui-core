(function (angular) {

    'use strict';

    /**
     * Each section of the site has its own module. It probably also has
     * submodules, though this boilerplate is too simple to demonstrate it. Within
     * `src/app/home`, however, could exist several additional folders representing
     * additional modules that would then be listed as dependencies of this one.
     * For example, a `note` section could have the submodules `note.create`,
     * `note.delete`, `note.edit`, etc.
     *
     * Regardless, so long as dependencies are managed correctly, the build process
     * will automatically take take of the rest.
     *
     * The dependencies block here is also where component dependencies should be
     * specified, as shown below.
     */
    angular.module( 'scentui.home', [
      'ui.router',
      'scentui',
      'scent.core.role'
    ])

    /**
     * Each section or module of the site can also have its own routes. AngularJS
     * will handle ensuring they are all available at run-time, but splitting it
     * this way makes each module more "self-contained".
     */
    .config(function config( $stateProvider ) {
        $stateProvider.state( 'home', {
            url: '/home',
            views: {
                'main': {
                    controller: 'HomeCtrl',
                    templateUrl: 'home/home.tpl.html'
                    // resolve: {
                    //     roles: function (roleService, currentUser) {
                    //                return roleService.query({ userId : currentUser.userId },
                    //                                           function(data) {
                    //                                               console.log(data);
                    //                                           },
                    //                                           function(response) {
                    //                                               //$scope.errorJson = response;
                    //                                               console.log(response);
                    //                                           });
                    //            }
                    // }
                }
            },
            data:{ pageTitle: 'Home' }
        });
    })

    /**
     * And of course we define a controller for our route.
     */
    .controller( 'HomeCtrl', function HomeController($scope, currentUser, $state, _) {

        $scope.user = currentUser;

        var states = _.pluck($state.get(), 'name');

        $scope.userRoles = ['TechAdmin', 'Teacher', 'Student'];
          // the user roles service will not exist in its current form, so we can just hardcode something instead.

        $scope.transitions = _.map($scope.userRoles, function (roleName) {
            return {
                     name    :  roleName,
                     enabled : _.contains(states, roleName.toLowerCase())
                   };
        });

        // console.log($scope.transitions);

        // $scope.errorJson = '';
        // $scope.userRoles = roles; //roleService.query({ userId : currentUser.userId });

        // $scope.userRoles.$promise.then(function (data) {
        //     console.log('promise fulfilled');
        //     console.log(data);
        // })

        $scope.classId = 'qd0mnkp3a2907m27h2s5ildt_8npbv20';
        $scope.apps = [
            { community: 'iread', name: 'iRead'    },
            { community: 'm180',  name: 'Math 180' }
        ];
    })

;})(window.angular);
