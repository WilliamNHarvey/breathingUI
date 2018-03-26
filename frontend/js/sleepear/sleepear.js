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
          .state('clinician', angularAMD.route({
                  url: '/clinician',
                  templateUrl: 'partials/clinician/index.html',
                  controller: 'clinicianController',
                  data: {
                      title: 'Clinician',
                  },
                  controllerUrl: 'sleepear/controllers/clinicianController'
              })
          )
          .state('clinicianSubmitting', angularAMD.route({
                  url: '/clinician',
                  templateUrl: 'partials/clinician/send.html',
                  controller: 'clinicianSubmittingController',
                  data: {
                      title: 'Send data',
                  },
                  controllerUrl: 'sleepear/controllers/clinicianController'
              })
          )
          .state('clinicianReport', angularAMD.route({
                  url: '/clinician',
                  templateUrl: 'partials/clinician/report.html',
                  controller: 'clinicianReportController',
                  data: {
                      title: 'Final report',
                  },
                  controllerUrl: 'sleepear/controllers/clinicianController'
              })
          )
          .state('technician', angularAMD.route({
                  url: '/technician',
                  templateUrl: 'partials/technician/index.html',
                  controller: 'technicianController',
                  data: {
                      title: 'Technician',
                  },
                  controllerUrl: 'sleepear/controllers/technicianController'
              })
          )
          .state('technicianSetup', angularAMD.route({
                  url: '/technician',
                  templateUrl: 'partials/technician/setup.html',
                  controller: 'technicianSetupController',
                  data: {
                      title: 'Set up patients',
                  },
                  controllerUrl: 'sleepear/controllers/technicianController'
              })
          )
          .state('technicianManage', angularAMD.route({
                  url: '/technician',
                  templateUrl: 'partials/technician/manage.html',
                  controller: 'technicianManageController',
                  data: {
                      title: 'Manage datasets',
                  },
                  controllerUrl: 'sleepear/controllers/technicianController'
              })
          )
          .state('technicianSend', angularAMD.route({
                  url: '/technician',
                  templateUrl: 'partials/technician/send.html',
                  controller: 'technicianSendController',
                  data: {
                      title: 'Send report',
                  },
                  controllerUrl: 'sleepear/controllers/technicianController'
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