var express = require('express');
var router = express.Router();
var passwordHash = require('password-hash');

// Model
var User = require('../../app/models/user');

/* Default route */
router.route('/user')
  
  // Creates
  .put(function(req, res){
    var user = new User();
    user.name = req.body.name;
    user.email = req.body.email;
    user.job = req.body.job;
    user.session = '';
    try {
        user.password = passwordHash.generate(req.body.password);
    }
    catch(err) {
        res.status(400);
        res.send(err);
        res.json({ message: "Bad password", passErr: true });
    }

    // save
    if(user.password) {
        user.save(function(err, newUser) {
            if (err) {
                res.status(401);
                res.send(err);
                res.json({ message: 'Registration failed' });
            }
            else {
                req.session.user = newUser.dataValues;
                req.session.save();
                var sid = req.sessionID;
                newUser.session = sid;
                newUser.save();
                //User.update({email: user.email}, {$set:{"session" : sid}});
                res.cookie('user_sid', sid, { maxAge: 86400000, httpOnly: true });
                res.status(200);
                res.json({ message: 'Registration successful', user: { name: user.name, email: user.email, job: user.job }, session: sid });
            }
        });
    }
  })

  // login
  .post(function(req, res){
    var email = req.body.email,
        password = req.body.password;
    User.findOne({email: email}, function(err, user) {
      if (err)
          res.send(err);
      if (!user) {
          res.status(400);
          res.json({ message: "User "+ email +" not found" });
      } else if (!passwordHash.verify(password, user.password)) {
          res.status(401);
          res.json({message: "Wrong password"});
      } else if (user.status === false) {
          res.status(403);
          res.json({message: "User has been deactivated. Please contact SleepEar."})
      } else {
          //req.session.regenerate();
          req.session.user = user.dataValues;
          req.session.save();
          var sid = req.sessionID;
          //user.session = sid;
          //user.markModified('session');
          //user.save();
          User.update({_id: user._id}, {'session': sid}, function(err, numAffected) {

          });
          res.cookie('user_sid', sid, { maxAge: 86400000, httpOnly: true });
          res.status(200);
          res.json({ message: "Login successful", user: { name: user.name, email: user.email, job: user.job }, session: sid });
      }
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