/*
 * Serve JSON to our AngularJS client
 */
var express = require('express');
var router = express.Router();
var app = require('../app');

// API modules
var breaths = require('./api/breaths');
var user = require('./api/user');
var session = require('./api/session');

// Register all modules here
router.use(breaths);
router.use(user);
router.use(session);

module.exports = router;
