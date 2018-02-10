define([
  'app'
  ], function(app) {
  'use strict';

  app.controller('breathsController', function($rootScope, $scope, $location, $window, breathsService, $compile) {
      window.ondragstart = function() { return false; };
      $scope.switchPage = $rootScope.switchPage;
      $scope.location = /[^/]*$/.exec($location.path())[0];

      if(typeof($window.breathSet) === "undefined") {
          $window.breathSet = false;
      }
      else {
          $window.breathSet = true;
      }
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

      $window.down = false;
      var barChart = $scope.barOptions.chart;
      var max = Math.min($('#circle-1').parent().height() * 0.9, $('#circle-1').parent().width() * 0.9) - 26;
      var newSize;
      var t;
      var increaseSize = function() {
          //newSize = $('#circle-1').height() * 1.01 + 1;
          newSize = max*(1-1*Math.pow(1.015,(-t))) + 26;
          $('#circle-1').height(newSize);
          $('#circle-1').width(newSize);
          t++;
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
          t = 0;
          intervalId = setInterval(increaseSize, 30);
      }
      function startBar() {
          barInterval = setInterval(increaseOxygen, 700);
      }
      function stop() {
          clearInterval(intervalId);

      }
      function stopBar() {
          clearInterval(barInterval);
      }

      $('body').keydown(function(e) {
          if(e.keyCode === 32 && !$window.down){
              //if(!down) stop();
              $('#circle-1').stop(true);
              $("#circle-2").stop(true, true);
              if($('#circle-1').width() !== 25) {
                  $('#circle-1').css({'width':'25px', 'height':'25px'});
              }
              $window.down = true;

              start();
              startBar();
          }
      }).keyup(function(u) {
          if(u.keyCode === 32 && $window.down) {
              stop();
              stopBar();
              $window.down = false;

              $scope.barData[0].values[0].value = 40;
              $scope.barData[0].values[1].value = 60;
              $scope.barApi.update();
              //$scope.$apply()

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

      $scope.recording = false;
      var $recButton = $("#recordButton");
      var $circle = $(".record-circle");
      var $text = $(".record-text");
      var recSwitching = false;

      $recButton.click(function() {
          if(recSwitching) {
              return false;
          }
          recSwitching = true;

          if($scope.recording) {
              $circle.animate({'opacity': 1}, 300, function() {
                  $scope.recording = false;
                  $scope.$digest();
              });
              $text.fadeOut(150, function() {
                  $text.text('Record').fadeIn(150, function() {
                      recSwitching = false;
                  });
              });
          }
          else {
              $circle.animate({'opacity': 0}, 300, function() {
                  $scope.recording = true;
                  $scope.$digest();
              });
              $text.fadeOut(150, function() {
                  $text.text('Pause').fadeIn(150, function() {
                      recSwitching = false;
                  });
              });
          }
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
                  lastProducedValue = Math.random() * 2 - 1;//Math.random() * 10;
              } else {
                  if (lastProducedValue > 0.5 && !$window.down) {
                      lastProducedValue -= Math.random() * 2;
                  } else if (lastProducedValue > 4 && $window.down) {
                      lastProducedValue -= Math.random() * 1;
                  } else if (lastProducedValue > 3 && $window.down) {
                      lastProducedValue += Math.random() * 1;
                  } else if (lastProducedValue < -0.5) {
                      lastProducedValue += Math.random() * 2;
                  } else {
                      if($window.down) {
                          lastProducedValue += Math.random() * 2;
                      }
                      else {
                          lastProducedValue += Math.random() * 3 - 1.5;
                      }
                  }

              }

              return [now, lastProducedValue];
          }

          function produceRestData() {
              data.push(produceValue());

              while (data.length > 248) {
                  data.shift();
              }
          }

          for (var i = 248; i > 0; i--) {
              data.push(produceValue(now - i * 250))
          }

          setInterval(function() {
              produceRestData();
          }, 250);





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
              bottom: 50,
              left: 50
          },
          height = 200 - margin.top - margin.bottom,
          width = 650 - margin.left - margin.right;


      function formatter(time) {
          if ((time.getSeconds() % 10) !== 0) {
              return "";
          }
          return d3.time.format('%M:%S')(time);
      }

      var data = restData.getData();
      console.log(data);
      var x = d3.time.scale()
          .domain(d3.extent(data, function(d) {
              return d[0];
          }))
          .range([0, width]);

      var y = d3.scale.linear()
          .domain([-2, 5])
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
              .duration(250)
              .ease("linear")
              .attr("transform", "translate(" + (x(0) - x(250)) + ")");


          var currentTime = new Date().getTime();
          var startTime = currentTime - 60000;
          x.domain([startTime, currentTime]);
          xAxis.scale(x);

          //move the xaxis left
          svg.select(".x.axis")
              .transition()
              .duration(250)
              .ease("linear")
              .call(xAxis);
      }

      update();
      setInterval(update, 400);

  })
  .controller('submitController', function($rootScope, $scope, $location, $window, LS, $compile) {
      $scope.switchPage = $rootScope.switchPage;
      var d3 = $window.d3;

      $scope.data = [
          {
              eeg: [[1518286584989,0.38935709820049147],[1518286585239,-0.2040483630356551],[1518286585489,-0.47322207786089265],[1518286585739,-0.21275760207948746],[1518286585989,-1.0137327855620941],[1518286586239,0.34547914019506054],[1518286586489,1.1468199425343255],[1518286586739,0.42611103284747776],[1518286586989,-0.38444124101252486],[1518286587239,0.6377175029900077],[1518286587489,-0.27681192897193707],[1518286587739,-1.5236687885177],[1518286587989,0.4215565439373983],[1518286588239,1.0522930781141657],[1518286588489,0.0689252190693821],[1518286588739,0.11279051141782448],[1518286588989,-1.1515978340797264],[1518286589239,-0.08296857509829669],[1518286589489,-1.051898931831162],[1518286589739,0.03211855738279201],[1518286589989,-1.1405198976282696],[1518286590239,0.23715078074064277],[1518286590489,0.7241112039564159],[1518286590739,0.07922414171852443],[1518286590989,1.5262929195131685],[1518286591239,0.24744951343011268],[1518286591489,0.6415897527488883],[1518286591739,-1.2633956670667454],[1518286591989,-1.161908922213049],[1518286592239,-0.7196360494244938],[1518286592489,-0.5102892908740779],[1518286592739,0.8509731078046769],[1518286592989,-0.1282927828493614],[1518286593239,0.36729366075943704],[1518286593489,-0.3872249371734602],[1518286593739,-1.359452428887738],[1518286593989,-0.4113392272971519],[1518286594239,-1.4644220929320757],[1518286594489,-1.0377948102853378],[1518286594739,0.2621118794807846],[1518286594989,0.33113668350395775],[1518286595239,1.1364777812255435],[1518286595489,0.24247659833697766],[1518286595739,1.1730986579200784],[1518286595989,-0.17822746334713946],[1518286596239,0.564894586283184],[1518286596489,-0.6357602836810541],[1518286596739,-0.25859656083200466],[1518286596989,-0.7463828228076561],[1518286597239,-0.016456745394014094],[1518286597489,-0.34059261001033914],[1518286597739,1.0357535597557517],[1518286597989,0.25250350988162307],[1518286598239,-0.021887183021002565],[1518286598489,0.011442831757287886],[1518286598739,-0.9007948398269103],[1518286598989,0.6625069245794373],[1518286599239,0.0958635196783606],[1518286599489,-0.3297765466651148],[1518286599739,0.28573664508874863],[1518286599989,1.1624001027709223],[1518286600239,-0.8170158283968023],[1518286600489,-0.17158451806796382],[1518286600739,-0.0003328356054577153],[1518286600989,0.256722841550036],[1518286601239,0.1363705826129029],[1518286601489,-1.157561653687724],[1518286601739,-0.4440074478761942],[1518286601989,-0.35337390222808684],[1518286602239,0.029119998081165832],[1518286602489,-1.2560915554580312],[1518286602739,-0.08359192945031113],[1518286602989,-1.5282180828595329],[1518286603239,-0.04510940040793665],[1518286603489,0.31048789259189213],[1518286603739,-0.48321588601966203],[1518286603989,-1.4334694615316634],[1518286604239,0.04140212061920878],[1518286604489,-0.7689707259509639],[1518286604739,-0.3835622523292439],[1518286604989,-0.8008254761944444],[1518286605239,0.4853081824647112],[1518286605489,0.471025589447885],[1518286605739,-0.6324717820866521],[1518286605989,-0.2145180065817347],[1518286606239,0.8849014956334762],[1518286606489,-0.7496740326668241],[1518286606739,0.5453237090265919],[1518286606989,-0.8821465294406501],[1518286607239,0.8611706382462172],[1518286607489,-1.1127025981843635],[1518286607739,-0.9528367309570842],[1518286607989,-0.31449129113014207],[1518286608239,-1.0845084055871714],[1518286608489,-0.6777486101162076],[1518286608739,0.45933765899184476],[1518286608989,-0.3678105778020373],[1518286609239,-0.7677487787846764],[1518286609489,-0.7116922677871287],[1518286609739,-0.37054497951566967],[1518286609989,0.20291830820961332],[1518286610239,0.7035699334593644],[1518286610489,0.08697451045010363],[1518286610739,0.22710131938656564],[1518286610989,0.8094473206323987],[1518286611239,-0.4300757354922238],[1518286611489,0.6389845021937257],[1518286611739,-0.9950834432094158],[1518286611989,0.8926268977687932],[1518286612239,0.7885087926662966],[1518286612489,-0.6396978019606514],[1518286612739,1.1436345935594712],[1518286612989,0.8536606296271267],[1518286613239,0.6524219111790963],[1518286613489,-1.1901669928107588],[1518286613739,-0.34530396731849167],[1518286613989,0.5588134654577324],[1518286614239,-1.221635090767429],[1518286614489,-0.35881127271630064],[1518286614739,-1.8549379920868199],[1518286614989,0.00899572822859751],[1518286615239,1.0078569348832471],[1518286615489,-0.9729628672972535],[1518286615739,-0.6264760592969405],[1518286615989,-0.22495985968945753],[1518286616239,-1.0393549801774506],[1518286616489,-0.0024774723001028676],[1518286616739,-1.466389137046014],[1518286616989,-0.1323380375226484],[1518286617239,1.3203501960215371],[1518286617489,0.15427537249983247],[1518286617739,-0.43870581334881],[1518286617989,-1.2243790180861294],[1518286618239,-1.0115686646521205],[1518286618489,-0.2320406634244847],[1518286618739,0.320105426169933],[1518286618989,-0.3959556828867157],[1518286619239,-0.4152879508380951],[1518286619489,-0.02821277598823002],[1518286619739,-0.6722121066502027],[1518286619989,0.6542926005196514],[1518286620239,-0.13028739572127734],[1518286620489,0.5882983010918543],[1518286620739,-1.1597944714163952],[1518286620989,-0.5545650739510439],[1518286621239,-0.050860983554396055],[1518286621489,-0.7919606257892342],[1518286621739,-0.6043261865989775],[1518286621989,1.0912368885258301],[1518286622239,1.0580115316610361],[1518286622489,0.31462937147657666],[1518286622739,-0.8001777868654503],[1518286622989,0.7214944629150315],[1518286623239,-0.9549217632331866],[1518286623489,0.05935555547628546],[1518286623739,-0.588689607618148],[1518286623989,-0.1801580757480361],[1518286624239,1.1217800975862013],[1518286624489,-0.6344619324803451],[1518286624739,0.06339463768386033],[1518286624989,0.23601163121634983],[1518286625239,-1.2145316201285432],[1518286625813,-0.6393361163031637],[1518286626020,0.8565820212209418],[1518286626290,0.5800129408224843],[1518286626527,-1.261168606011514],[1518286626838,0.23162069898119553],[1518286627096,-0.7659972026162829],[1518286627316,0.17486394364950852],[1518286627532,-0.2799110260177289],[1518286627835,-0.061030548596933576],[1518286628066,-0.3052720935737647],[1518286628283,-1.529678099050902],[1518286628533,0.020621837061396198],[1518286628783,-0.39690634797204893],[1518286629039,-0.14397078410798714],[1518286629273,1.3369990415900224],[1518286629529,-0.07078000242235327],[1518286629779,1.3496167176867375],[1518286630031,0.4496852040730015],[1518286630334,1.818225654400335],[1518286630565,0.10147135823336906],[1518286630765,-0.9676608455024498],[1518286631032,0.9454528028894091],[1518286631295,0.715817945150766],[1518286631521,-0.28035856893861366],[1518286631769,0.9061451706656336],[1518286632035,0.04716760666385422],[1518286632263,0.8011171687661482],[1518286632520,-0.9675873787752609],[1518286632763,0.37090097534326105],[1518286633071,0.4670063616702116],[1518286633278,-0.8686738425481946],[1518286633546,0.6729699901413513],[1518286633787,-0.4860991258771672],[1518286634035,-1.7083068803172072],[1518286634281,-0.5649777646165204],[1518286634533,0.1560372900342959],[1518286634786,-1.0975671985567834],[1518286635028,0.12408300997812094],[1518286635271,1.0251845949199099],[1518286635525,0.9287133204572215],[1518286635765,-0.11502818920792302],[1518286636032,-0.6988305993502444],[1518286636267,1.244207601985971],[1518286636521,0.7777711123363564],[1518286636782,0.26297771600250086],[1518286637020,1.7338203149277678],[1518286637280,-0.023448161267235923],[1518286637529,0.36791620336981445],[1518286637774,1.0990452968595674],[1518286638022,-0.8975207112439918],[1518286638260,-0.38271269287139775],[1518286638534,0.581763342946799],[1518286638767,0.22893135348230453],[1518286639009,1.5284500830333854],[1518286639292,-0.21740416227360448],[1518286639529,0.5881036680102647],[1518286639783,0.40501018155663404],[1518286640028,0.9252050739213074],[1518286640272,-0.5987273841332472],[1518286640527,0.8955344420769467],[1518286640770,0.2717890267504104],[1518286641022,0.07414356706022196],[1518286641279,-0.46254590933733075],[1518286641522,-0.6440438983124714],[1518286641766,-0.2955280232968702],[1518286642033,-1.128883557103583],[1518286642277,-0.29575780731997536],[1518286642540,0.40879998268349693],[1518286642759,1.0354208633888806],[1518286643044,-0.8949951822708684],[1518286643274,0.04869506283566993],[1518286643530,-0.17149511859717714],[1518286643782,0.3558060735517272],[1518286644030,-1.0867788590782521],[1518286644271,-0.5702714737129975],[1518286644523,1.395218123592741],[1518286644781,0.28934518048293145],[1518286645041,0.8960575756070319],[1518286645284,-0.5752859539609221],[1518286645523,1.3605480077359202],[1518286645791,0.32035566145781424],[1518286646037,1.7148995459734222],[1518286646269,1.5582993785965449],[1518286646523,0.10704629806615773],[1518286646767,-0.30106323565322257],[1518286647026,0.7686251724879376]],
              bar: [{"key":"Cumulative Return","values":[{"label":"+O²","value":40},{"label":"-O²","value":60}]}]
          }
      ];

      $scope.barOptions = {
          chart: {
              type: 'discreteBarChart',
              height: 170,
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

      function formatter(time) {
          if ((time.getSeconds() % 10) !== 0) {
              return "";
          }
          return d3.time.format('%M:%S')(time);
      }

      angular.forEach($scope.data, function(val, key) {
          var $dataSet = $($compile('<div id="data-'+key+'" class="data-set"><div class="data-delete">✖</div><div class="data-eeg"></div><div class="data-bar with-3d-shadow with-transitions" style="overflow-x:auto;"><nvd3 data="data['+key+'].bar" options="barOptions" api="barApi"></nvd3></div><div class="data-send"><div class="arrow"></div></div></div>')($scope));
          $("#dataBody").append($dataSet);

          var data = val.eeg;

          var margin = {
                  top: 20,
                  right: 20,
                  bottom: 50,
                  left: 50
              },
              height = 170 - margin.top - margin.bottom,
              width = 650 - margin.left - margin.right;

          var x = d3.time.scale()
              .domain(d3.extent(data, function(d) {
                  return d[0];
              }))
              .range([0, width]);

          var y = d3.scale.linear()
              .domain([-2, 5])
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


          var svg = d3.select($dataSet.children(".data-eeg").get(0)).append("svg")
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
      });


      angular.forEach($(".data-send"), function() {
          var $child = $(this).children()[0];

          $child.click(function(e) {
              if(!$rootScope.detectLeftButton(e)) {
                  return false;
              }

              var $this = $(this);

              if($this.hasClass("arrow")) {
                  $this.addClass("checkmark").removeClass("arrow");
              }
              else if($this.hasClass("checkmark")) {
                  $this.addClass("arrow").removeClass("checkmark");
              }
          });
      });

      $(".data-delete").click(function() {
          var $parent = $(this).parent();
          $parent.animate({
              opacity: 0
          }, 500, function() {
              $parent.remove();
              // Animation complete.
          });
      });


  });
});