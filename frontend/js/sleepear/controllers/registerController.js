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

        $scope.test = function() {
            console.log('register test');
        };

        $scope.register = function($user) {
            console.log($user);
            $scope.loading = true;
            userService.register($user).then(function(status) {
                console.log(status);
                $scope.loading = false;
                $scope.registered = true;
            });

        }
    });
});