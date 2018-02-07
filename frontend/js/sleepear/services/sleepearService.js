define([
    'angularAMD',
], function(angularAMD) {
  'use strict';

  angularAMD.factory('breathsService', [
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

    .factory('breathService', ['$rootScope, $resource', function ($rootScope, $resource) {

        var service = {

            model: {

            },

            SaveState: function () {
                sessionStorage.breathService = angular.toJson(service.model);
            },

            RestoreState: function () {
                service.model = angular.fromJson(sessionStorage.breathService);
            },

            resource: function() {
                return $resource(
                    'api/breaths/:_id',
                    {_id: '@_id'},
                    {
                        update: {
                            method: 'PUT'
                        }
                    }
                );
            }
        };

        $rootScope.$on("savestate", service.SaveState);
        $rootScope.$on("restorestate", service.RestoreState);

        return service;
    }]);

});
