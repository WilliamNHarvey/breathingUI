define([
    'angularAMD',
], function(angularAMD) {
  'use strict';

  angularAMD
    .factory("LS", function($window, $rootScope) {
      return {
          setData: function(storage, val) {
              $window.localStorage && $window.localStorage.setItem(storage, val);
              return this;
          },
          getData: function(storage) {
              return $window.localStorage && $window.localStorage.getItem(storage);
          }
      };
    })
    .factory('submitService', [
        '$resource',
        function($resource) {

            this.resource = function() {
                return $resource(
                    'api/breaths/:_id',
                    { _id: '@_id' },
                    {
                        update: {
                            method: 'PUT'
                        }
                    }
                );
            };

            return this;
        }
    ])

    .factory('breathsService', ['$rootScope', function ($rootScope) {

        var service = {

            model: {

            },

            SaveState: function () {
                sessionStorage.breathService = angular.toJson(service.model);
            },

            RestoreState: function () {
                service.model = angular.fromJson(sessionStorage.breathService);
            }
        };

        $rootScope.$on("savestate", service.SaveState);
        $rootScope.$on("restorestate", service.RestoreState);

        return service;
    }])

    .factory('userService', ['$rootScope', '$http', '$q', function ($rootScope, $http, $q) {

        var service = {
            login: function ($user) {
                return $http({
                    method : 'POST',
                    url : '/api/user',
                    data : $user
                }).catch(function(reason){
                    return $q.when({status: false});
                });
            },

            register: function ($user) {
                return $http({
                    method : 'PUT',
                    url : '/api/user',
                    data : $user
                }).catch(function(reason){
                    return $q.when({status: false});
                });
            },

            checkSession: function () {
                return $http({
                    method : 'POST',
                    url : '/api/session'
                }).catch(function(reason){
                    console.log('reason', reason);
                    return $q.when({status: false});
                });
            },

            logout: function () {
                return $http({
                    method : 'DELETE',
                    url : '/api/session'
                }).catch(function(reason){
                    console.log('reason', reason);
                    return $q.when({status: false});
                });
            },

            getAll: function() {
                return $http({
                    method : 'POST',
                    url : '/api/user/get'
                }).catch(function(reason){
                    console.log('reason', reason);
                    return $q.when({status: false});
                });
            },

            connect: function(req) {
                return $http({
                    method : 'POST',
                    url : '/api/user/connect',
                    data : req
                }).catch(function(reason){
                    console.log('reason', reason);
                    return $q.when({status: false});
                });
            }
        };

        return service;
    }]);

});
