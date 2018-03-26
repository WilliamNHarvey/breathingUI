require.config({
    baseUrl : 'js',
    paths : {
        // AngularJS
        'angular'               : '//ajax.googleapis.com/ajax/libs/angularjs/1.6.7/angular',
        'angular.resource'    : '//ajax.googleapis.com/ajax/libs/angularjs/1.6.7/angular-resource.min',
        'angular.animate'     : '//ajax.googleapis.com/ajax/libs/angularjs/1.6.7/angular-animate.min',
        'angular.sanitize'    : '//ajax.googleapis.com/ajax/libs/angularjs/1.6.7/angular-sanitize.min',
        'angular.pt-br'       : '//cdnjs.cloudflare.com/ajax/libs/angular-i18n/1.2.15/angular-locale_pt-br',

        // AngularAMD
        'angularAMD'          : '/frontend/lib/angularAMD/angularAMD.min',
        'ngload'              : '/frontend/lib/angularAMD/ngload.min',

        // Other libs
        'ngProgress'          : '/frontend/lib/ngprogress/build/ngProgress.min',
        'ngCookies'           : '//ajax.googleapis.com/ajax/libs/angularjs/1.6.9/angular-cookies',
        'angular-ui-router'   : '/frontend/lib/angular-ui-router/release/angular-ui-router.min',
        'checklist-model'     : '/frontend/lib/checklist-model/checklist-model',
        'angular-flash'       : '/frontend/lib/angular-flash/dist/angular-flash.min',
        'd3'                  : '/frontend/lib/d3/d3.min',
        'nvd3'                : '/frontend/lib/nvd3/build/nv.d3',
        'angular-nvd3'        : '/frontend/lib/angular-nvd3/dist/angular-nvd3.min',

        // jQuery
        'jquery'              : '//ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min',
    },

    shim : {
        'angular' : {
            deps : ['jquery'],
            exports : 'angular'
        },
        'angular.route' : {
            deps : ['angular']
        },
        'angular.resource' : {
            deps : ['angular']
        },
        'angular.animate' : {
            deps : ['angular']
        },
        'angular.sanitize' : {
            deps : ['angular']
        },
        'angular.pt-br' : {
            deps : ['angular']
        },
        'ngProgress': {
            deps : ['angular']
        },
        'ngCookies': {
            deps : ['angular']
        },
        'angular-ui-router': {
            deps : ['angular']
        },
        'checklist-model': {
            deps : ['angular']
        },
        'angular-flash': {
            deps : ['angular']
        },
        'angularAMD': {
            deps : ['angular']
        },
        'd3': {
            exports: 'd3'
        },
        'nvd3': {
            deps : ['d3'],
            exports: 'nv'
        },
        'angular-nvd3': {
            deps : ['angular', 'd3', 'nvd3']
        },
        'ngload': {
            deps : ['angularAMD']
        },
        'jquery': {
            exports: '$'
        }
    },
    deps: ['app']
});
require(['d3'], function(d3) {
    'use strict';
    window.d3 = d3;
    require(['nvd3'], function(nvd3) {

    });
});