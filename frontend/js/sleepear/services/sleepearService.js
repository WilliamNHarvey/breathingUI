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
  ]);

});