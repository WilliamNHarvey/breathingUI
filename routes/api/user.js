var express = require('express');
var router = express.Router();
var passwordHash = require('password-hash');

// Model
var User = require('../../app/models/user');

/* Default route */
router.route('/user')
  
  // Creates a breath (accessed at POST /api/breaths)
  .post(function(req, res){
    var user = new User();
    user.name = req.body.name;
    user.email = req.body.email;
    user.password = passwordHash.generate(req.body.password);
    user.job = req.body.job;

    // save the breath and check for errors
    user.save(function(err) {
      if (err) {
          res.status(401);
          res.send(err);
          res.json({ message: 'Registration failed' });
      }
      else {
          res.status(200);
          res.json({ message: 'Registration successful' });
      }



    });
  })

  // Get all breathss (accessed at GET /api/breathss)
  .get(function(req, res){
    User.find(function(err, breaths) {
      if (err)
          res.send(err);

      res.json(breaths);
    });
  })

  .delete(function(req, res) {
    User.remove({
      _id: req.params.breath_id
    }, function(err, breath) {
      if (err)
        res.send(err);

      res.json({ message: 'breath deleted' });
    });
  });

module.exports = router;