define([
    'angularAMD',
    'angular.resource',
    'angular.sanitize',
    'angular.animate',
    'angular.pt-br',
    'checklist-model',
    'ngProgress',
    'angular-ui-router',
    'angular-flash'
], function (angularAMD) {
    'use strict';

    var app = angular.module('App', [
        'ngResource',
        'ngSanitize',
        'ngAnimate',
        'ngProgress',
        'ui.router',
        'App.sleepear',
        'angular-flash.service',
        'angular-flash.flash-alert-directive'
    ]);

    // Constants
    // Project defaults
    app.constant('projectDefaults', {
        name: 'Project Name',
        description: 'Project description'
    });

    // App Config
    app.config(function ($provide, $locationProvider, $stateProvider, $urlRouterProvider, flashProvider, $rootScope, $window, $location) {

        $locationProvider.html5Mode(true);


        $provide.decorator('$state', function($delegate) {
            $delegate.reinit = function() {
                this.transitionTo(this.current, this.$current.params, { reload: true, inherit: true, notify: true });
            };
            return $delegate;
        });

        $stateProvider
            .state('index', angularAMD.route({
                    url: '/index',
                    templateUrl: 'partials/index.html',
                    controller: function($scope) {}
                })
            );

        $urlRouterProvider.otherwise('/');

        // Flash messages config
        flashProvider.errorClassnames.push('alert-danger');
        flashProvider.successClassnames.push('alert-success');


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

    });

    app.run(function ($rootScope, $state, $stateParams, ngProgress, projectDefaults, flash) {
        // Expose $state and $stateParams to $rootScope
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;

        // Project defaults
        $rootScope.project = projectDefaults;

        // Set progressbar events
        ngProgress.color('#18bc9c');
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
        });
    });

    return angularAMD.bootstrap(app);
});