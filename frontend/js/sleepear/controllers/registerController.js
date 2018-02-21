define([
    'app'
], function(app) {
    'use strict';

    app.controller('registerController', function ($rootScope, $scope, $location, $window, breathsService, $compile, LS) {
        window.ondragstart = function () {
            return false;
        };
        $scope.switchPage = $rootScope.switchPage;
        $scope.location = /[^/]*$/.exec($location.path())[0];

        $scope.test = function() {
            console.log('register test');
        }
    });
});