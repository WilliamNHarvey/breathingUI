define([
    'angularAMD',
    'angular.resource',
    'angular.sanitize',
    'angular.animate',
    'angular.pt-br',
    'checklist-model',
    'ngProgress',
    'angular-ui-router',
    'angular-flash',
    'sleepear/sleepear',
    'd3',
    'angular-nvd3'
], function (angularAMD) {
    'use strict';

    var app = angular.module('App', [
        'ngResource',
        'ngSanitize',
        'ngAnimate',
        'ngProgress',
        'ui.router',
        'App.sleepear',
        //'angular-flash.service',
        'angular-flash.flash-alert-directive',
        'nvd3'
    ]);

    // Constants
    // Project defaults
    app.constant('projectDefaults', {
        name: 'SleepEar',
        description: 'Project description'
    });

    // App Config
    app.config(function ($provide, $locationProvider, $stateProvider, $urlRouterProvider, flashProvider) {

        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });


        $provide.decorator('$state', function($delegate) {
            $delegate.reinit = function() {
                this.transitionTo(this.current, this.$current.params, { reload: true, inherit: true, notify: true });
            };
            return $delegate;
        });

        $stateProvider
            .state('index', angularAMD.route({
                    url: '/',
                    templateUrl: 'partials/index.html',
                    controller: function($scope) {

                    }
                })
            );

        $urlRouterProvider.otherwise('/');

        // Flash messages config
        flashProvider.errorClassnames.push('alert-danger');
        flashProvider.successClassnames.push('alert-success');




    });

    app.run(function ($rootScope, $state, $stateParams, ngProgress, projectDefaults, flash, $window, $location) {
        // Expose $state and $stateParams to $rootScope
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;

        // Project defaults
        $rootScope.project = projectDefaults;

        $rootScope.removeSlideLeft = false;
        $rootScope.switchPage = function (path, pageAnimationClass) {

            if (typeof(pageAnimationClass) === 'undefined') { // Use a default, your choice
                $rootScope.pageAnimationClass = 'crossFade';
            }

            else { // Use the specified animation
                $rootScope.pageAnimationClass = pageAnimationClass;
                if(pageAnimationClass === 'slideLeft') {
                    $rootScope.removeSlideLeft = true;
                }
                if(pageAnimationClass === 'slideRight') {
                    $rootScope.removeSlideRight = true;
                }
            }

            if (path === 'back') { // Allow a 'back' keyword to go to previous page
                $window.history.back();
            }

            else { // Go to the specified path
                $location.path(path);
            }
        };

        $rootScope.$on("$routeChangeStart", function (event, next, current) {
            if (sessionStorage.restorestate === "true") {
                $rootScope.$broadcast('restorestate'); //let everything know we need to restore state
                sessionStorage.restorestate = false;
            }
        });

        $rootScope.detectLeftButton = function(evt) {
            evt = evt || $window.event;
            if ("buttons" in evt) {
                return evt.buttons === 1;
            }
            var button = evt.which || evt.button;
            return button === 1;
        };

        //let everthing know that we need to save state now.
        $window.onbeforeunload = function (event) {
            $rootScope.$broadcast('savestate');
        };

        // Set progressbar events
        /*ngProgress.color('#18bc9c');
        $rootScope.$on("$stateChangeStart", function (event, next, current) {
            ngProgress.reset();
            ngProgress.start();
        });
        $rootScope.$on("$stateChangeSuccess", function (event, current, previous) {
            ngProgress.complete();
        });
        $rootScope.$on("$stateChangeError", function (event, current, previous, rejection) {
            flash.error = "Could not complete the request.";
            ngProgress.complete();
        });*/
    });

    return angularAMD.bootstrap(app);
});