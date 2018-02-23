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
        $scope.loggedIn = false;
        userService.checkSession().then(function(res) {
            if(!res) {
                console.log('err');
            }
            else if(res.status === 200) {
                console.log('logged in', res.data.user);
                $scope.loggedIn = true;
                $scope.user = res.data.user;
            }
            else {
                console.log('logged out')
            }
        });

        $scope.logout = function() {
            userService.logout().then(function(res) {
                $window.location.reload();
            })
        };


    });
});