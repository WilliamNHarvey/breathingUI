define([
    'app'
], function(app) {
    'use strict';

    app.controller('indexController', function ($rootScope, $scope, $location, $window, breathsService, $compile, LS, userService, $cookies) {
        window.ondragstart = function () {
            return false;
        };
        $scope.switchPage = $rootScope.switchPage;
        $scope.location = /[^/]*$/.exec($location.path())[0];
        console.log($cookies.getAll());
    });
});