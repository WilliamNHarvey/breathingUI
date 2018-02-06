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
          newSize = $('#circle-1').height() * 1.03 + 1;
          $('#circle-1').height(newSize);
          $('#circle-1').width(newSize);
      };
      var intervalId;
      function start() {
          intervalId = setInterval(increaseSize, 30);
      }
      function stop() {
          clearInterval(intervalId);
      }

      $(document).ready(function(){
          $('body').keydown(function(e) {
              if(e.keyCode === 32 && !down){
                  //if(!down) stop();
                  $('#circle-1').stop(true);
                  $("#circle-2").stop(true, true);
                  if($('#circle-1').width() !== 25) {
                      $('#circle-1').css({'width':'25px', 'height':'25px'});
                  }
                  down = true;

                  start();
              }
          }).keyup(function(u) {
              if(u.keyCode === 32 && down) {
                  stop();
                  down = false;

                  $('#circle-1').animate({'width':'25px', 'height':'25px'}, 150, function() {
                      if(!bouncing) {
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

      $scope.barOptions = {
          chart: {
              type: 'discreteBarChart',
              height: 220,
              margin : {
                  top: 20,
                  right: 0,
                  bottom: 30,
                  left: 65
              },
              x: function(d){return d.label;},
              y: function(d){return d.value;},
              showValues: true,
              valueFormat: function(d){
                  return $window.d3.format(',.4f')(d);
              },
              duration: 500,
              xAxis: {
                  axisLabel: 'Oxy/Deoxyhemoglobin',
                  axisLabelDistance: -10
              },
              yAxis: {
                  axisLabel: '%',
                  axisLabelDistance: -10,
                  ticks: 6,
                  rotateYLabel: true,
                  orient: 'left',
                  css:{ 'transform':'rotate(90deg)' }
              },
              color: ["#D32F2F", "#42A5F5"]
          }
      };

      $scope.barData = [
          {
              key: "Cumulative Return",
              values: [
                  {
                      "label" : "+O²",
                      "value" : 40
                  },
                  {
                      "label" : "-O²",
                      "value" : 60
                  }
              ]
          }
      ]

  });
});