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
  .controller('submitController', function($rootScope, $scope, $location, $window, LS) {
      $scope.switchPage = $rootScope.switchPage;
      var d3 = $window.d3;
      
      $scope.data = [
          {
            line: [[1518255963867,-1.0781354020868825],[1518255964855,-0.8395176118548227],[1518255965857,0.7616148032821286],[1518255966858,0.16461938873517656],[1518255967858,1.5492777708382013],[1518255968857,1.2393918698357425],[1518255969858,0.5625560452217213],[1518255970858,0.48939703809886304],[1518255971871,0.182875565521869],[1518255972859,-0.9030392912773215],[1518255973855,-0.42685337234008314],[1518255974858,1.0432618919225],[1518255975862,-0.868327635836387],[1518255976863,0.8142993594119297],[1518255977864,0.8084040042610399],[1518255978861,-0.9080454003617593],[1518255979865,-0.6619689931384123],[1518255980864,0.8374666090874099],[1518255981867,-1.047477929330967],[1518255982857,0.1836527805312218],[1518255983858,-0.1646161385131919],[1518255984908,-0.8631036670429004],[1518255985857,-0.28332796149529726],[1518255986858,0.4672661405360039],[1518255987858,0.9597344899687479],[1518255988854,-0.17292238859735365],[1518255989856,-0.19745654169695404],[1518255990867,-1.0215653397420703],[1518255991862,0.10344985006688212],[1518255992859,0.29386934175473023],[1518255993862,1.2541255267692417],[1518255994869,0.5969630842789222],[1518255995861,0.5244445767235981],[1518255996859,-0.526820638878728],[1518255997857,0.6094696685897407],[1518255999614,-0.5407948380939631],[1518256000421,0.03897727042757726],[1518256000931,1.0278432081747857],[1518256001865,0.01678776472112098],[1518256002860,0.8762075327841674],[1518256003856,-0.3355237333399388],[1518256004869,-1.704515335819006],[1518256005869,-0.7625335650241769],[1518256006861,-0.7356906176608435],[1518256007875,-0.5726466790950726],[1518256008867,-0.3718405083074001],[1518256009870,0.25836110280451785],[1518256010864,0.010859940099629428],[1518256011863,-0.3986117755226388],[1518256012864,-1.171660371443212],[1518256013869,0.7965346768526747],[1518256014864,0.04637775171866698],[1518256015860,0.24270001604802016],[1518256016940,0.46346359872810683],[1518256018427,0.5255179732113633],[1518256018859,-1.2817153667501207],[1518256019858,-0.11989145278445879],[1518256020873,1.039687656144678],[1518256021856,-0.35144026548581975],[1518256022856,-0.09860292659388925],[1518256023859,-1.0221841893291943],[1518256024869,0.011724187018426147],[1518256025866,-1.4014328763044543],[1518256026869,-1.3434555910621684],[1518256027859,-0.4620009939250582],[1518256028861,-0.258345976203596],[1518256029853,0.8286431129953842],[1518256030860,-0.9095387656069263],[1518256031854,0.3002310471157039],[1518256032869,1.31961142058632],[1518256033858,0.4832009519379299],[1518256034862,-0.11374447332638904],[1518256035863,-1.6102104571761802],[1518256036853,-0.948098129174707],[1518256037855,0.6723155867626966],[1518256038878,-0.2519249369319423],[1518256040117,-1.5268072584740455],[1518256040862,0.3303241633013325],[1518256041867,0.3495768133689867],[1518256042855,-0.2070848331075208],[1518256043860,0.2622982172674879],[1518256044868,1.5348108950914203],[1518256045858,1.0191813675406851],[1518256046867,0.42816959007246513],[1518256047861,1.6772415139236476],[1518256048864,1.6233013386588508],[1518256049861,1.443159217823824],[1518256050867,1.2722859555150898],[1518256051862,0.3337341789124064],[1518256052863,1.0493740327998151],[1518256053863,0.23843196556214608],[1518256054867,1.4046448955124076],[1518256055859,0.05788376536724327],[1518256056855,-0.6525519036014717],[1518256057855,0.47165369524773304],[1518256058853,-0.9932841502200431],[1518256059860,0.20361470117344993],[1518256060857,0.0006143380736274295],[1518256061862,0.43434608171283684],[1518256062862,1.515858328447851],[1518256063862,0.7510057011297502],[1518256064857,0.06468593064316441],[1518256065853,-0.25127793540845],[1518256066861,0.7845353300615872],[1518256067862,-0.44829588752420846],[1518256068858,-1.0446750326682612],[1518256069861,-0.038759554964216125],[1518256071990,-0.7738018264007303],[1518256072872,-0.6034969928504128],[1518256073862,0.0016690473183134102],[1518256074855,-0.801940805620311],[1518256075868,0.20328997087263678],[1518256076868,0.31479653292106713],[1518256077857,-0.6692264161567478],[1518256078853,-0.5289801265668199],[1518256079855,0.8908522377847437],[1518256080258,0.23250150740830078],[1518256081854,-0.4556773948385855],[1518256082771,-1.7713137639596865],[1518256082985,-0.2529079038914943],[1518256083188,-0.451940184526177],[1518256083460,-0.12474898626717512],[1518256083709,-1.4432977080311478],[1518256083936,-0.29193685152432325],[1518256084193,-1.4022063168020735],[1518256084450,-0.6137540352376103],[1518256084689,0.09749134250867897],[1518256084952,-0.057923833617109954],[1518256085189,-0.8183001672803585],[1518256085466,-0.03178881402847655],[1518256085720,-0.31448436078842334],[1518256085953,-0.10750492594884542],[1518256086211,-1.3334519844502606],[1518256086450,0.48793239911370945],[1518256086700,1.1806174667677598],[1518256086946,-0.056180878750957675],[1518256087198,-1.0442619083467206],[1518256087429,0.16531504949091902],[1518256087705,0.9381606505759525],[1518256087947,-0.05845648665819958],[1518256088196,0.2557730453844618],[1518256088434,-0.6214742078333209],[1518256088702,-0.28067283951541366],[1518256088932,-0.5109231455335874],[1518256089188,0.2152522695839303],[1518256089447,-0.028388176553298283],[1518256089690,-0.5944907410049995],[1518256089927,0.3097362401943462],[1518256090184,1.7207821123733016],[1518256090430,1.5503728205396698],[1518256090681,0.4143712077748094],[1518256090926,-0.251268750175631],[1518256091209,-0.3874331980016912],[1518256091434,0.9953971101148325],[1518256091697,0.973732036003998],[1518256091957,0.7969533450949875],[1518256092198,0.45459241032274056],[1518256092448,-0.2791088645546562],[1518256092693,0.9159147832469343],[1518256092935,-0.6035798145957005],[1518256093179,0.009886719025705482],[1518256093440,-0.1939345094376972],[1518256093675,0.8754942869758013],[1518256093939,0.5320876235501666],[1518256094189,-0.8093854330890935],[1518256094433,0.128618477772936],[1518256094694,-1.0186196273124626],[1518256094952,0.17841829696821465],[1518256095181,-0.8845106568735084],[1518256095440,-0.7861442403933354],[1518256095700,-0.5183038347374838],[1518256095928,0.3148230300197563],[1518256096190,1.0062269156547974],[1518256096439,-0.7045580012322687],[1518256096687,-0.61325312185496],[1518256096945,-0.24018131381860042],[1518256097179,-1.461370503370643],[1518256097436,-0.7345141518861005],[1518256097693,0.6798959152525685],[1518256097941,-0.7646834699432303],[1518256098193,-0.009752309906146728],[1518256098428,0.7825341393508332],[1518256098700,-0.7896026133604783],[1518256098934,0.8544962945045307],[1518256099175,-0.2709849302730194],[1518256099456,0.14851623567347438],[1518256099688,-1.0224463225680722],[1518256099926,-0.41625744650705876],[1518256100178,0.36042118924106425],[1518256100441,-0.869405400261388],[1518256100696,-0.22414862083391363],[1518256100936,0.10892986728014775],[1518256101193,-0.2121219741929845],[1518256101449,0.5997839141320578],[1518256101700,-0.8192566956497236],[1518256101947,0.11930939477212754],[1518256102192,0.21039829752292927],[1518256102427,0.3736889881540062],[1518256102684,-0.5113258093068815],[1518256102938,1.2222672689451637],[1518256103156,0.6022364425678284],[1518256103450,-0.24417112244080097],[1518256103702,-0.9917114304448964],[1518256103936,-0.776077674094781],[1518256104190,-0.17090014862434377],[1518256104444,0.3776512155513403],[1518256104681,-0.5761634264912503],[1518256104936,0.706658703158386],[1518256105200,-1.1482697502778032],[1518256105427,-1.0735936557540129],[1518256105677,0.7780014429916384],[1518256105946,-0.21011546548629156],[1518256106195,0.4031920043543573],[1518256106432,0.4484468138462747],[1518256106682,-0.8903575564013542],[1518256106938,0.7718069551259634],[1518256107192,0.7679137526364843],[1518256107453,0.6686739120203682],[1518256107716,-1.0792333608129359],[1518256107961,0.49550868419410676],[1518256108195,-0.7678364908302506],[1518256108419,-0.6852917169302524],[1518256108706,-0.37891543384057114],[1518256108951,1.0772606011675814],[1518256109200,-0.07405532681088767],[1518256109457,-0.9212518273741099],[1518256109701,0.03280868140106241],[1518256109930,-0.20634739716551231],[1518256110195,-1.272029181713235],[1518256110428,0.15390943388856249],[1518256110703,-0.6009942458565463],[1518256110950,0.5457295845084364],[1518256111184,-0.32131549035007145],[1518256111441,-1.6887286644937154],[1518256111685,-0.8364669110625154],[1518256111936,-0.16197986997564406],[1518256112188,1.2461650117019323],[1518256112433,-0.5272655135918352],[1518256112652,1.0237368042675676],[1518256112947,0.13990871487792367],[1518256113188,0.8787291827394292],[1518256113431,-0.7083024665011575],[1518256113694,0.053703459990889435],[1518256113929,1.4307798915207988],[1518256114190,1.270832114755247],[1518256114440,0.09082209520144957],[1518256114679,0.4034047196521977],[1518256114928,0.2912522472091701]]
          }
      ];

      function formatter(time) {
          if ((time.getSeconds() % 10) !== 0) {
              return "";
          }
          return d3.time.format('%M:%S')(time);
      }

      $scope.data.forEach(function(key, val) {

          var $dataSet = $(`<div id="data-${key}" class="data-set"></div>`);
          $("#dataBody").append($dataSet);

          var data = val.line;

          var margin = {
                  top: 20,
                  right: 20,
                  bottom: 50,
                  left: 50
              },
              height = 200 - margin.top - margin.bottom,
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


          var svg = d3.select($dataSet.get(0)).append("svg")
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
  });
});