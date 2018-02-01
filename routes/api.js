/*
 * Serve JSON to our AngularJS client
 */
var express = require('express');
var router = express.Router();
var app = require('../app');

// API modules
var breaths = require('./api/breaths');

// Register all modules here
router.use(breaths);

module.exports = router;
