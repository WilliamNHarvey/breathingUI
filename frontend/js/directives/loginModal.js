define([
    'app'
], function() {
  'use strict';

  var login = angular.module('App.login', []);
  login.directive('loginModal', function() {
    return {
      restrict: 'AEC',
      templateUrl: 'login.html',
      scope: {
        loginAs: '=loginAs'
      },
      controller: function($rootScope, $scope, $element, breathsService){
          $scope.test = function() {
              console.log('test');
              console.log('loginAs: ', $scope.loginAs);
          }
      }/*,
      compile: function(element) {
        // Adds a listener to submit function
        element.on('submit', function(e) {
          element.fadeTo('fast', 0.5);
          element.find('.btn-submit').text('Wait...').attr('disabled', 'disabled');
        });
      }*/
    }
  });

});
