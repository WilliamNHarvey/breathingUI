var express = require('express');
var router = express.Router();

// Model
var User = require('../../app/models/user');
var Session = require('../../app/models/session');

/* Default route */
router.route('/session')

    // check
    .post(function(req, res){
        var email = req.body.email,
            sid = req.session.regenerate();
            //sid = req.body.session;

        User.findOne({email: email, session: sid}, function(err, user) {
            if (err)
                res.send(err);
            if (!user) {
                res.status(401);
                res.json({ message: email +" not found with "+sid });
            } else if (user.status === false) {
                res.status(403);
                res.json({message: "User has been deactivated. Please contact SleepEar."})
            } else {
                //Session.findOne({_id: sid},  function(err, session) {
                    //if(err) {
                        //res.send(err);
                    //} else if(Date.now() > session.expires) {
                    //    res.status(401);
                    //    res.json({ message: "Session expired" });
                    //    session.remove();
                    //}
                    //else {
                        res.status(200);
                        res.json({ message: "Login successful", user: { name: user.name, email: user.email, job: user.job } });
                    //}
                //});
            }
        });
    });

module.exports = router;