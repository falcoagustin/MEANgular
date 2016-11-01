// Get the packages we need
var express = require('express');
var mongoose = require('mongoose');
var Donator = require('./donator');
var bodyParser = require('body-parser');

// Create our Express application
var app = express();
// Start the server
var server = app.listen(3000);

var io = require('socket.io')(server);

io.on('connection', function(socket){
  console.log('User has connected.');
});

// Connect to the donators MongoDB
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/donate-now');

// Use the body-parser package in our application
app.use(bodyParser());

// Use environment defined port or 3000
var port = process.env.PORT || 3000;

// Create our Express router
var router = express.Router();

// Create a new route with the prefix /donators
var donatorsRoute = router.route('/donators');

// Create endpoint /api/donators for POSTS
donatorsRoute.post(function(req, res) {
  // Create a new instance of the Donator model
  var donator = new Donator();
  // Set the donator properties that came from the POST data
  donator.name = req.body.name;
  donator.lastName = req.body.lastName;
  donator.contactNumber = req.body.contactNumber;
  donator.email = req.body.email;
  donator.address = req.body.address;
  donator.bloodGroup = req.body.bloodGroup;
  donator.xCoord = req.body.xCoord;
  donator.yCoord = req.body.yCoord;
  io.sockets.emit('event', donator);
  // Save the donator and check for errors
  donator.save(function(err) {
    if (err)
      res.send(err);
    res.json(true);
  });
});

donatorsRoute.get(function(req, res) {
  // Use the Donator model to find all beer
  Donator.find(function(err, donators) {
    if (err)
      res.send(err);

    res.json(donators);
  });
});

var donatorRoute = router.route('/donators/:donator_id');

donatorRoute.get(function(req, res) {
  // Use the Donator model to find a specific donator
  Donator.findById(req.params.donator_id, function(err, donator) {
    if (err)
      res.send(err);

    res.json(donator);
  });
});

// Register all our routes with /api
app.use('/api', router);
app.use('/', express.static(__dirname + '/../public'));

console.log('Server running ' + port);
