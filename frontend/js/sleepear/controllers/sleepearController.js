define([
  'app'
  ], function(app) {
  'use strict';

  app.controller('breathsController', function($rootScope, $scope, $location, $window) {
      window.ondragstart = function() { return false; };
      $scope.switchPage = $rootScope.switchPage;
      $scope.location = /[^/]*$/.exec($location.path())[0];

      function bounce() {
          $('.circle-1').animate({

              'width': "-=20",
              'height': "-=20"/*,
              'top': parseInt($('.circle-1').css('top')) + 10,
              'left': parseInt($('.circle-1').css('left')) + 10*/

          }, 150);
          $('.circle-1').animate({

              'width': "+=30",
              'height': "+=30"/*,
              'top': "-=15",
              'left': "-=15"*/

          }, 150);
          $('.circle-1').animate({

              'width': "-=20",
              'height': "-=20"/*,
              'top': parseInt($('.circle-1').css('top')) + 5,
              'left': parseInt($('.circle-1').css('left')) + 5*/

          }, 150);
          $('.circle-1').animate({

              'width': "+=10",
              'height': "+=10"/*,
              'top': "-=5",
              'left': "-=5"*/

          }, 150);
      }

      var down = false;

      var max = Math.min($(window).height(), $(window).width());

      var grower;
      $('body').keydown(function(e) {
          if(e.keyCode == 32){
              down = true;

              grower = setInterval(function() {
                  //var newheight = $('circle-1').height() + $('circle-1').height() * 0.02
                  var newSize = $('.circle-1').height() * 1.02;

                  $('.circle-1').css({
                      height: newSize,
                      width: newSize
                  })
              }, 100);

              $('body').keyup(function(u) {
                  if(e.keyCode == 32 && down) {
                      clearInterval(grower);
                      down = false;
                      $('body').unbind("keyup");
                      $('.circle-1').animate({width:'25px', height:'25px'}, 150, function(){
                          bounce();
                      });
                      /*$('.circle-1').css({
                          height: "25px",
                          width: "25px"
                      })*/
                  }

                  else if (!down) {
                      $('body').unbind("keyup")
                  }
              });
          }
      });
  });
});