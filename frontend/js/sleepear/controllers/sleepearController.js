define([
  'app'
  ], function(app) {
  'use strict';

  app.controller('breathsController', function($rootScope, $scope, $location, $window) {
      window.ondragstart = function() { return false; };
      $scope.switchPage = $rootScope.switchPage;
      $scope.location = /[^/]*$/.exec($location.path())[0];

      var bouncing;
      function bounce() {
          bouncing = true;
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
          bouncing = false;
      }

      var down = false;

      var max = Math.min($(window).height(), $(window).width());
      var newSize;
      var increaseSize = function() {
          newSize = $('#circle-1').height() * 1.04 + 1;
          $('#circle-1').height(newSize);
          $('#circle-1').width(newSize);
      }
      var intervalId;
      function start() {
          intervalId = setInterval(increaseSize, 50);
      }
      function stop() {
          clearInterval(intervalId);
      }

      $(document).ready(function(){
          $('body').keydown(function(e) {
              if(e.keyCode === 32 && !down){
                  //if(!down) stop();
                  down = true;

                  start();
              }
          }).keyup(function(u) {
              if(u.keyCode === 32 && down) {

                  stop();
                  down = false;

                  $('#circle-1').animate({'width':'25px', 'height':'25px'}, {
                      queue       : false,
                      duration    : 150,
                      complete    : function() {
                          bounce();
                      }
                  });
                  $('#circle-2').animate({
                      'opacity' : 0,
                      'width': newSize,
                      'height': newSize
                  }, 300, function() {
                      $('#circle-2').css({
                          'opacity' : 1,
                          'width': 0,
                          'height': 0
                      })
                  });
              }
          });
      });

  });
});