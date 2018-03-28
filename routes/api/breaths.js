var express = require('express');
var router = express.Router();

// Model
var Breath = require('../../app/models/breath');

/* Default route */
router.route('/breaths')
  
  // Creates a breath (accessed at POST /api/breaths)
  .post(function(req, res){
    var breath = new Breath();
    breath.name = req.body.name;
    breath.type = req.body.type;

    // save the breath and check for errors
    breath.save(function(err) {
      if (err)
        res.send(err);

      res.json({ message: 'breaths created!' });
    });
  })

  // Get all breathss (accessed at GET /api/breathss)
  .get(function(req, res){
    Breath.find(function(err, breaths) {
      if (err)
          res.send(err);

      res.json(breaths);
    });
  });

router.route('/breaths/:breath_id')
  
  // Get the breath by id (accessed at GET /api/breaths/:breath_id)
  .get(function(req, res) {
    breath.findById(req.params.breath_id, function(err, breath) {
      if (err)
        res.send(err)

      res.json(breath);
    });
  })

  // Update the breath with this id (accessed at PUT /api/breaths/:breath_id)
  .put(function(req, res) {
    // use our bear model to find the bear we want
    Breath.findById(req.params.breath_id, function(err, breath) {
      if (err)
        res.send(err);

      breath.name = req.body.name;
      breath.type = req.body.type;

      // save the breath
      breath.save(function(err) {
        if (err)
          res.send(err);

        res.json({ message: 'breath updated!' });
      });
    });
  })

  // delete the breath with this id (accessed at DELETE /api/breaths/:breath_id)
  .delete(function(req, res) {
    Breath.remove({
      _id: req.params.breath_id
    }, function(err, breath) {
      if (err)
        res.send(err);

      res.json({ message: 'breath deleted' });

    });
  });

router.route('/breaths/test')
    .post(function(req, res){
        var breath = {};
        //var body = JSON.parse(req.body);
        breath.name = req.body.name;//.name;
        breath.signal = req.body.signal;
        res.status(200);
        res.json({ message: 'i got it thanks', data: {thename: breath.name, thesignal: breath.signal}});
    });

module.exports = router;