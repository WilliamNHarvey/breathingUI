define([
  'app'
  ], function(app) {
  'use strict';

  app.controller('technicianController', function($rootScope, $scope, $location, $window, $compile, LS, userService) {
      window.ondragstart = function() { return false; };
      $scope.switchPage = $rootScope.switchPage;
      $scope.location = /[^/]*$/.exec($location.path())[0];

      /*userService.checkSession().then(function(res) {
          if(!res) {
              $location.path("/");
          }
          else if(res.status === 200) {
              $scope.user = res.data.user;
              if($scope.user.job !== "patient") {
                  $location.path("/");
              }
          }
          else {
              $location.path("/");
          }
      });*/

      var storedData = JSON.parse(LS.getData("storedData"));

  })
      .controller('technicianSetupController', function($rootScope, $scope, $location, $window, $compile, LS, userService) {
          window.ondragstart = function() { return false; };
          $scope.switchPage = $rootScope.switchPage;
          $scope.location = /[^/]*$/.exec($location.path())[0];

          /*userService.checkSession().then(function(res) {
           if(!res) {
           $location.path("/");
           }
           else if(res.status === 200) {
           $scope.user = res.data.user;
           if($scope.user.job !== "patient") {
           $location.path("/");
           }
           }
           else {
           $location.path("/");
           }
           });*/

          var storedData = JSON.parse(LS.getData("storedData"));

      })
      .controller('technicianManageController', function($rootScope, $scope, $location, $window, $compile, LS, userService) {
          window.ondragstart = function() { return false; };
          $scope.switchPage = $rootScope.switchPage;
          $scope.location = /[^/]*$/.exec($location.path())[0];

          /*userService.checkSession().then(function(res) {
           if(!res) {
           $location.path("/");
           }
           else if(res.status === 200) {
           $scope.user = res.data.user;
           if($scope.user.job !== "patient") {
           $location.path("/");
           }
           }
           else {
           $location.path("/");
           }
           });*/

          var storedData = JSON.parse(LS.getData("storedData"));

      })
      .controller('technicianSendController', function($rootScope, $scope, $location, $window, $compile, LS, userService) {
          window.ondragstart = function() { return false; };
          $scope.switchPage = $rootScope.switchPage;
          $scope.location = /[^/]*$/.exec($location.path())[0];

          /*userService.checkSession().then(function(res) {
           if(!res) {
           $location.path("/");
           }
           else if(res.status === 200) {
           $scope.user = res.data.user;
           if($scope.user.job !== "patient") {
           $location.path("/");
           }
           }
           else {
           $location.path("/");
           }
           });*/

          var storedData = JSON.parse(LS.getData("storedData"));

      });
});