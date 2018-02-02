define([
  'app'
  ], function(app) {
  'use strict';

  app.controller('breathsController', function($rootScope, $scope, $location, $window) {
      window.ondragstart = function() { return false; };
      $scope.switchPage = $rootScope.switchPage;
      $scope.location = /[^/]*$/.exec($location.path())[0];

      var down = false;

      var max = $(window).height();

      var grower;
      $('body').keydown(function(e) {
          if(e.keyCode == 32){
              down = true;

              grower = setTimeout(function() {
                  //var newheight = $('circle-1').height() + $('circle-1').height() * 0.02
                  var newheight = max/(1 + 2.718^(-0.02 * ($('circle-1').height())));
                  console.log(newheight);
                  $('.circle-1').css({
                      height: newheight,
                      width: newheight
                  })
              }, 100);

              $('body').keyup(function(u) {
                  if(e.keyCode == 32 && down) {
                      clearTimeout(grower);
                      down = false;
                      $('body').unbind("keyup")
                      $('circle-1').css({
                          height: "25px",
                          width: "25px"
                      })
                  }

                  else if (!down) {
                      $('body').unbind("keyup")
                  }
              });
          }
      });
  });
});