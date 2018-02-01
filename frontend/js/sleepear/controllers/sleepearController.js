define([
  'app'
  ], function(app) {
  'use strict';

  app.controller('breathsController', function($rootScope, $scope, $location, $window, LS) {
      window.ondragstart = function() { return false; };
      $scope.switchPage = $rootScope.switchPage;
      $scope.location = /[^/]*$/.exec($location.path())[0];

  });
});