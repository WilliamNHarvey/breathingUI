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
        user.save(function(err) {
            if (err) {
                res.status(401);
                res.send(err);
                res.json({ message: 'Registration failed' });
            }
            else {
                res.status(200);
                res.json({ message: 'Registration successful', user: { name: user.name, email: user.email, job: user.job } });
                req.session.user = user.dataValues;
                req.session.save();
                User.update({email: user.email}, {$set:{"session" : req.sessionID}});
            }
        });
    }
  })

  // login
  .post(function(req, res){
    var email = req.body.email,
        password = req.body.password;
    var sid = req.sessionID;
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
          req.session.user = user.dataValues;
          req.session.save();
          sessionStore.destroy(user.session, function(){
              User.update({_id: user._id}, {$set:{"session" : sid}});
          }
          res.cookie('SleepEarSess'+user._id, sid, { maxAge: 60000, httpOnly: true })
          res.status(200);
          res.json({ message: "Login successful", user: { name: user.name, email: user.email, job: user.job } });
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