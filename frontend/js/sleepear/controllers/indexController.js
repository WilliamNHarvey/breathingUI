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
        var user_session = JSON.parse(LS.getData('user_session'));
        console.log(user_session);
        if(user_session) {
            userService.checkSession(user_session).then(function(res) {
                if(!res) {
                    console.log('err');
                }
                else if(res.status === 200) {
                    console.log('logged in', res.data.user);
                }
                else {
                    console.log('logged out')
                }
            });
        }

    });
});