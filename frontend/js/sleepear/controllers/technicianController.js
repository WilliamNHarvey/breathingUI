define([
  'app'
  ], function(app) {
  'use strict';

  app.controller('technicianController', function($rootScope, $scope, $location, $window, $compile, LS, userService) {
      window.ondragstart = function() { return false; };
      $scope.switchPage = $rootScope.switchPage;
      $scope.location = /[^/]*$/.exec($location.path())[0];
      $rootScope.child = false;
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
          $rootScope.child = true;
          $scope.error = false;
          $scope.loading = true;
          userService.getAll().then(function(res) {
              console.log(res);
              $scope.loading = false;
              if(!res) {
                  $scope.error = true;
              }
              else if(res.status === 200) {
                  /*$.each(res.message.users, function(n, v) {

                  });
                  $scope.chooseCountries=[
                      {countryId : 1, name : "France - Mainland", desc: "some description" },
                      {countryId : 2, name : "Gibraltar", desc: "some description"},
                      {countryId : 3, name : "Malta", desc: "some description"}
                  ];

                  $scope.selectedCountry = $scope.chooseCountries[0].countryId;*/
              }
              else {
                  $scope.error = true;
              }
          });

      })
      .controller('technicianManageController', function($rootScope, $scope, $location, $window, $compile, LS, userService) {
          window.ondragstart = function() { return false; };
          $scope.switchPage = $rootScope.switchPage;
          $scope.location = /[^/]*$/.exec($location.path())[0];
          $rootScope.child = true;
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
          $rootScope.child = true;
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