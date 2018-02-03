define([
  'angularAMD',
  'sleepear/services/sleepearService',
  ], function (angularAMD) {
    'use strict';

  var sleepear = angular.module('App.sleepear', []);

  // App Config
  sleepear.config(["$stateProvider", function ($stateProvider, $urlRouterProvider) {
      $stateProvider
          .state('breathing', angularAMD.route({
                  url: '/breaths',
                  templateUrl: 'partials/breaths/index.html',
                  controller: 'breathsController',
                  data: {
                      title: 'Breaths',
                  },
                  controllerUrl: 'sleepear/controllers/sleepearController',
                  resolve: {
                      breaths: ['breathsService', function(breathsService) {
                          //return beerService.resource().query().$promise;
                      }]
                  }
              })
          )
  }]);

  return sleepear;
});