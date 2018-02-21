define([
  'angularAMD',
  'sleepear/services/sleepearService',
  ], function (angularAMD) {
    'use strict';

  var sleepear = angular.module('App.sleepear', []);

  // App Config
  sleepear.config(["$stateProvider", function ($stateProvider, $urlRouterProvider) {
      $stateProvider
          .state('index', angularAMD.route({
                  url: '/',
                  templateUrl: 'partials/index.html',
                  controller: 'indexController',
                  controllerUrl: 'sleepear/controllers/indexController',
                  resolve: {
                      breaths: ['breathsService', function(breathsService) {
                          //return beerService.resource().query().$promise;
                      }]
                  }
              })
          )
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
          .state('submitting', angularAMD.route({
                  url: '/submit',
                  templateUrl: 'partials/breaths/submit.html',
                  controller: 'submitController',
                  data: {
                      title: 'Submit',
                  },
                  controllerUrl: 'sleepear/controllers/sleepearController',
                  resolve: {
                      breaths: ['submitService', function(submitService) {
                          //return beerService.resource().query().$promise;
                      }]
                  }
              })
          )
          .state('login', angularAMD.route({
                  url: '/login',
                  templateUrl: 'partials/login.html',
                  controller: 'loginController',
                  data: {
                      title: 'Login',
                  },
                  controllerUrl: 'sleepear/controllers/loginController',
                  resolve: {
                      breaths: ['submitService', function(submitService) {
                          //return beerService.resource().query().$promise;
                      }]
                  }
              })
          )
          .state('register', angularAMD.route({
                  url: '/register',
                  templateUrl: 'partials/register.html',
                  controller: 'registerController',
                  data: {
                      title: 'Register',
                  },
                  controllerUrl: 'sleepear/controllers/registerController',
                  resolve: {
                      breaths: ['submitService', function(submitService) {
                          //return beerService.resource().query().$promise;
                      }]
                  }
              })
          )
  }]);

  return sleepear;
});