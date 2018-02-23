define([
    'angularAMD',
    'angular.resource',
    'angular.sanitize',
    'angular.animate',
    'angular.pt-br',
    'checklist-model',
    'ngProgress',
    'ngCookies',
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
        'ngCookies',
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

        $urlRouterProvider.otherwise('/');

        // Flash messages config
        flashProvider.errorClassnames.push('alert-danger');
        flashProvider.successClassnames.push('alert-success');




    });

    app.run(function ($rootScope, $state, $stateParams, ngProgress, projectDefaults, flash, $window, $location, userService) {
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

        userService.checkSession().then(function(res) {
            if(!res) {
                $rootScope.loggedIn = false;
                $rootScope.loggedOut = true;
            }
            else if(res.status === 200) {
                console.log('logged in', res.data.user);
                $rootScope.loggedIn = true;
                $rootScope.loggedOut = false;
                $rootScope.user = res.data.user;
            }
            else {
                console.log('logged out');
                $rootScope.loggedOut = true;
                $rootScope.loggedIn = false;
            }
        });

        $rootScope.$on("$routeChangeStart", function (event, next, current) {

            if (sessionStorage.restorestate === "true") {
                $rootScope.$broadcast('restorestate'); //let everything know we need to restore state
                sessionStorage.restorestate = false;
            }

            userService.checkSession().then(function(res) {
                if(!res) {
                    $rootScope.loggedIn = false;
                    $rootScope.loggedOut = true;
                }
                else if(res.status === 200) {
                    console.log('logged in', res.data.user);
                    $rootScope.loggedIn = true;
                    $rootScope.loggedOut = false;
                    $rootScope.user = res.data.user;
                }
                else {
                    console.log('logged out');
                    $rootScope.loggedOut = true;
                    $rootScope.loggedIn = false;
                }

                console.log($location.path());
                if(!$rootScope.loggedIn) {
                    if($location.path() !== "/" && $location.path() !== "") {
                        event.preventDefault();
                        $location.path("/");
                    }
                }
                else if($rootScope.user.job === "patient" && $location.path() !== "/" && $location.path() !== ""
                    && $location.path() !== "/breaths" && $location.path() !== "/submit") {
                    event.preventDefault();
                    $location.path("/");
                }
                else if($rootScope.user.job === "doctor" && $location.path() !== "/" && $location.path() !== "") {
                    console.log('here');
                    event.preventDefault();
                    $location.path("/");
                }
                else if($rootScope.user.job === "technician" && $location.path() !== "/" && $location.path() !== "") {
                    event.preventDefault();
                    $location.path("/");
                }
                else if($rootScope.user.job === "visitor" && $location.path() !== "/" && $location.path() !== "") {
                    event.preventDefault();
                    $location.path("/");
                }
            });



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