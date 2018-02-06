define([
  'app'
  ], function(app) {
  'use strict';

  app.controller('breathsController', function($rootScope, $scope, $location, $window) {
      window.ondragstart = function() { return false; };
      $scope.switchPage = $rootScope.switchPage;
      $scope.location = /[^/]*$/.exec($location.path())[0];
      var d3 = $window.d3;
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
                  return $window.d3.format(',.1f')(d);
              },
              duration: 250,
              xAxis: {
                  axisLabel: 'Oxy/Deoxyhemoglobin',
                  axisLabelDistance: -10
              },
              yAxis: {
                  axisLabel: '% Abundance',
                  axisLabelDistance: -10,
                  ticks: 6
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
      ];

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
      var barChart = $scope.barOptions.chart;
      var max = Math.min($(window).height(), $(window).width());
      var newSize;
      var increaseSize = function() {
          newSize = $('#circle-1').height() * 1.02 + 1;
          $('#circle-1').height(newSize);
          $('#circle-1').width(newSize);
      };
      var increaseOxygen = function() {
          if($scope.barData[0].values[0].value < 100 && $scope.barData[0].values[1].value > 0) {
              $scope.barData[0].values[0].value++;
              $scope.barData[0].values[1].value--;
              $scope.barApi.update();
          }
      };
      var cycle = 0;
      var top = $('.top');
      var bottom = $('.bottom');
      var changePressure = function() {
          var topel = parseInt(top.text());
          var botel = parseInt(bottom.text());
          switch(cycle) {
              case 0:
                  top.text(topel + (Math.floor(Math.random() * 2) + 1));
                  bottom.text(botel + (Math.floor(Math.random() * 2) + 1));
                  break;
              case 1:
                  top.text(topel - (Math.floor(Math.random() * 2) + 1));
                  bottom.text(botel - (Math.floor(Math.random() * 2) + 1));
                  break;
              case 2:
                  top.text(topel - (Math.floor(Math.random() * 2) + 1));
                  bottom.text(botel - (Math.floor(Math.random() * 2) + 1));
                  break;
              case 3:
                  top.text(topel + (Math.floor(Math.random() * 2) + 1));
                  bottom.text(botel + (Math.floor(Math.random() * 2) + 1));
                  cycle = -1;
                  break;
              default:
                  top.text(topel + (Math.floor(Math.random() * 2) + 1));
                  bottom.text(botel + (Math.floor(Math.random() * 2) + 1));
          }
          cycle++;
      };
      var intervalId;
      var barInterval;
      var pressureInterval;
      pressureInterval = setInterval(changePressure, 3000);
      function start() {
          intervalId = setInterval(increaseSize, 30);
          barInterval = setInterval(increaseOxygen, 250);
      }
      function stop() {
          clearInterval(intervalId);
          clearInterval(barInterval);
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

                  $scope.barData[0].values[0].value = 40;
                  $scope.barData[0].values[1].value = 60;
                  $scope.barApi.update();

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


      var restData = (function() {

          var data = [];

          var now = new Date().getTime();



          var lastProducedValue;

          function produceValue(currentTime) {
              var now;
              if (currentTime) {
                  now = currentTime;
              } else {
                  now = new Date().getTime();
              }

              var newNumber;
              if (!lastProducedValue) {
                  lastProducedValue = (Math.floor((Math.random() - 0.5)) + 1) * 10;//Math.random() * 10;
              } else {
                  if (lastProducedValue > 9) {
                      lastProducedValue -= (Math.floor((Math.random() - 0.5)) + 1) * 2;
                  } else if (lastProducedValue < 1) {
                      lastProducedValue += (Math.floor((Math.random() - 0.5)) + 1) * 2;
                  } else {
                      lastProducedValue += (Math.floor((Math.random() - 0.5)) + 1) * 3 - 1.5;
                  }

              }


              return [now, lastProducedValue];
          }

          function produceRestData() {
              data.push(produceValue());

              while (data.length > 62) {
                  data.shift();
              }
          }

          for (var i = 62; i > 0; i--) {
              data.push(produceValue(now - i * 1000))
          }

          setInterval(function() {
              produceRestData();
          }, 1000);





          function getData() {
              return data;
          }

          return {
              getData: getData
          }
      })();





      var margin = {
              top: 20,
              right: 20,
              bottom: 30,
              left: 50
          },
          height = 200 - margin.top - margin.bottom,
          width = 650 - margin.left - margin.right;




      function formatter(time) {
          if ((time.getSeconds() % 10) != 0) {
              return "";
          }
          return d3.time.format('%m:%S')(time);
      }

      var data = restData.getData();
      var x = d3.time.scale()
          .domain(d3.extent(data, function(d) {
              return d[0];
          }))
          .range([0, width]);

      var y = d3.scale.linear()
          .domain([0, 10])
          .range([height, 0]);

      var xAxis = d3.svg.axis()
          .scale(x)
          .ticks(d3.time.seconds, 2)
          .tickFormat(formatter)
          .orient("bottom");

      var yAxis = d3.svg.axis()
          .scale(y)
          .orient("left");

      var line = d3.svg.line()
          .x(function(d) {
              return x(d[0]);
          })
          .y(function(d) {
              return y(d[1]);
          })
          .interpolate("linear");

      var svg = d3.select("#eegChart").append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      svg.append("g")
          .attr("class", "x axis")
          .attr("clipPath", "url(#innerGraph)")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);

      svg.append("g")
          .attr("class", "y axis")
          .call(yAxis)
          .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", ".71em")
          .style("text-anchor", "end");

      var holder = svg.append("defs");
      holder.append("svg:clipPath")
          .attr("id", "innerGraph")
          .append("svg:rect")
          .attr("x", 0)
          .attr("y", 0)
          .style("fill", "gray")
          .attr("height", height)
          .attr("width", width);

      svg.append("g")
          .attr("clip-path", "url(#innerGraph)")
          .append("svg:path")
          .attr("class", "line")
          .attr("d", line(data));

      //x
      svg.append("text")
          .attr("transform",
              "translate(" + (width/2) + " ," +
              (height + margin.top + 20) + ")")
          .style("text-anchor", "middle")
          .text("Time (m:s)");

      //y
      svg.append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 0 - margin.left)
          .attr("x",0 - (height / 2))
          .attr("dy", "1em")
          .style("text-anchor", "middle")
          .text("Voltage (mv)");

      function update() {
          data = restData.getData();
          //var svg = d3.select("svg");

          //move the graph left
          svg.select(".line")
              .attr("d", line(data))
              .attr("transform", null)
              .transition()
              .delay(0)
              .duration(1000)
              .ease("linear")
              .attr("transform", "translate(" + (x(0) - x(1000)) + ")");


          var currentTime = new Date().getTime();
          var startTime = currentTime - 60000;
          x.domain([startTime, currentTime]);
          xAxis.scale(x);

          //move the xaxis left
          svg.select(".x.axis")
              .transition()
              .duration(1000)
              .ease("linear")
              .call(xAxis);
      }

      setInterval(update, 1100);


  });
});