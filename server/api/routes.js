var express = require('express');
var router = express.Router();
// Prefix for donators routes.
var donatorsRoute =  router.route('/donators');
var donatorRoute =  router.route('/donators/:donator_id');

module.exports = { donatorsRoute, donatorRoute, router };

