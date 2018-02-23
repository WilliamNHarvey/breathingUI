var express = require('express');
var router = express.Router();

// Model
var User = require('../../app/models/user');
var Session = require('../../app/models/session');

/* Default route */
router.route('/session')

    // check
    .post(function(req, res){
        var sid = req.session.userId;
        User.findOne({_id: sid}, function(err, user) {
            if (err)
                res.send(err);
            if (!user) {
                res.status(401);
                res.json({ message: "Session user id doesn't match to any user" });
            } else if (user.status === false) {
                res.status(403);
                res.json({message: "User has been deactivated. Please contact SleepEar."})
            } else {
                res.status(200);
                res.json({ message: "Login successful", user: { name: user.name, email: user.email, job: user.job } });
            }
        });
    })

    .delete(function(req, res){
        req.session.destroy();
    });

module.exports = router;