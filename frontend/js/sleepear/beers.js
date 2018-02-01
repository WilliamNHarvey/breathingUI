define([
  'angularAMD',
  'sleepear/services/beerService',
  ], function (angularAMD) {
    'use strict';

  var sleepear = angular.module('App.sleepear', []);

  // App Config
  sleepear.config(function ($stateProvider, $urlRouterProvider) {

  });

  return sleepear;
});