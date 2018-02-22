define([
    'app'
], function(app) {
    'use strict';

    app.controller('registerController', function ($rootScope, $scope, $location, userService, LS) {
        window.ondragstart = function () {
            return false;
        };
        $scope.switchPage = $rootScope.switchPage;
        $scope.location = /[^/]*$/.exec($location.path())[0];
        $scope.loading = false;
        $scope.registered = false;
        $scope.failed = false;

        $scope.register = function($user) {
            $scope.registered = false;
            $scope.failed = false;
            $scope.loading = true;
            userService.register($user).then(function(res) {
                console.log(res);
                $scope.loading = false;
                if(res.status === 200) {
                    $scope.registered = true;
                    $rootScope.user = res.data.user;
                    LS.setData('user_email', $rootScope.user.email);
                    switch(res.data.user.job) {
                        case 'patient':
                            $location.path('/breaths');
                            break;
                        default:
                            $location.path('/');
                    }
                }
                else {
                    $scope.failed = true;
                }

            });

        }
    });
});