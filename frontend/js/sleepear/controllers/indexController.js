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
        var user_email = LS.getData('user_email');
        console.log(user_email);
        if(user_email) {
            userService.checkSession({email: user_email}).then(function(err, res) {
                if(err) {
                    console.log(err);
                }
                if(res.status === 200) {
                    console.log('logged in', res.data.user);
                }
                else {
                    console.log('logged out')
                }
            });
        }

    });
});