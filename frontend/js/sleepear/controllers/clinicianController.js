define([
  'app'
  ], function(app) {
  'use strict';

  app.controller('clinicianController', function($rootScope, $scope, $location, $window, $compile, LS, userService) {
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
      .controller('clinicianSubmittingController', function($rootScope, $scope, $location, $window, $compile, LS, userService) {
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
      .controller('clinicianReportController', function($rootScope, $scope, $location, $window, $compile, LS, userService) {
          window.ondragstart = function() { return false; };
          $scope.switchPage = $rootScope.switchPage;
          $scope.location = /[^/]*$/.exec($location.path())[0];
            console.log($scope.location);
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