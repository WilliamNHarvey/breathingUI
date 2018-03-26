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
        $scope.loggedIn = $rootScope.loggedIn;
        $scope.loggedOut = $rootScope.loggedOut;
        $scope.loggingOut = false;
        $scope.child = $rootScope.child;
        if($scope.child) {
            var s = document.createElement("script");
            s.type = "text/javascript";
            s.src = "//cdnjs.cloudflare.com/ajax/libs/require.js/2.1.11/require.min.js";
            s.dataset.main = "/js/childmain.js";
            $("head").append(s);
        }
        else {
            var s = document.createElement("script");
            s.type = "text/javascript";
            s.src = "//cdnjs.cloudflare.com/ajax/libs/require.js/2.1.11/require.min.js";
            s.dataset.main = "/js/main.js";
            $("head").append(s);
        }
        /*userService.checkSession().then(function(res) {
            if(!res) {
                console.log('err');
                $scope.loggedOut = true;
            }
            else if(res.status === 200) {
                console.log('logged in', res.data.user);
                $scope.loggedIn = true;
                $scope.user = res.data.user;
            }
            else {
                console.log('logged out');
                $scope.loggedOut = true;
            }
        });*/

        $scope.logout = function() {
            console.log('logout');
            $scope.loggingOut = true;
            userService.logout().then(function(res) {
                $scope.loggingOut = false;
                $rootScope.loggedOut = true;
                $rootScope.loggedIn = false;
                $window.location.reload();
            })
        };

        $scope.comingSoon = function() {
            console.log('coming soon');
            $("#snackbar").addClass("show");
            setTimeout(function(){ $("#snackbar").removeClass("show"); }, 3000);
        }

    });
});