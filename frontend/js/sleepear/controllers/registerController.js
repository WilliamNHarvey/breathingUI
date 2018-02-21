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

        $scope.test = function() {
            console.log('register test');
        }

        $scope.register = function($user) {
            console.log($user);
            var status = userService.register($user);
            console.log(status);
        }
    });
});