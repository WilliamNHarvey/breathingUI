define([
  'app'
  ], function(app) {
  'use strict';

  app.controller('breathsController', function($rootScope, $scope, $location, $window) {
      window.ondragstart = function() { return false; };
      $scope.switchPage = $rootScope.switchPage;
      $scope.location = /[^/]*$/.exec($location.path())[0];

      function bounce() {
          $('#circle-1').animate({

              'width': "-=20",
              'height': "-=20"/*,
              'top': parseInt($('.circle-1').css('top')) + 10,
              'left': parseInt($('.circle-1').css('left')) + 10*/

          }, 150);
          $('#circle-1').animate({

              'width': "+=30",
              'height': "+=30"/*,
              'top': "-=15",
              'left': "-=15"*/

          }, 150);
          $('#circle-1').animate({

              'width': "-=20",
              'height': "-=20"/*,
              'top': parseInt($('.circle-1').css('top')) + 5,
              'left': parseInt($('.circle-1').css('left')) + 5*/

          }, 150);
          $('#circle-1').animate({

              'width': "+=10",
              'height': "+=10"/*,
              'top': "-=5",
              'left': "-=5"*/

          }, 150);
      }

      var down = false;

      var max = Math.min($(window).height(), $(window).width());
      function increaseSize() {
          newSize = $('#circle-1').height() + 1;
          console.log(newSize);
          $('#circle-1').height(newSize);
          $('#circle-1').width(newSize);
      }
      var intervalId;
      function start() {
          intervalId = setInterval(increaseSize, 400);
      }
      function stop() {
          clearInterval(intervalId);
      }
      var newSize;
      $(document).ready(function(){
          $('body').keydown(function(e) {
              if(e.keyCode === 32){
                  //if(!down) stop();
                  down = true;

                  start();
              }
          }).keyup(function(u) {
              if(u.keyCode === 32 && down) {

                  stop();
                  down = false;

                  $('#circle-1').animate({'width':'25px', 'height':'25px'}, 150, function() {
                      bounce();
                  });
              }
          });
      });

  });
});