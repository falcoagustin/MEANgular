var server = require('../app.js');
var io = require('socket.io')(server);
var Donator = require('./donator');
var routes = require('./routes');

var donatorsRoute = routes.donatorsRoute;
var donatorRoute = routes.donatorRoute;

donatorsRoute.get(function(req, res) {
  // Use the Donator model to find all donators
  Donator.find(function(err, donators) {
    if (err)
      res.send(err);

    res.json(donators);
  });
});

donatorsRoute.post(function(req, res) {
  // Create a new instance of the Donator model
  var donator = new Donator();
  // Set the donator properties that came from the POST data
  donator.name = req.body.name;
  donator.lastName = req.body.lastName;
  donator.contactNumber = req.body.contactNumber;
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

donatorRoute.get(function(req, res) {
  // Use the Donator model to find a specific donator
  Donator.findById(req.params.donator_id, function(err, donator) {
    if (err)
      res.send(err);

    res.json(donator);
  });
});

module.exports = routes.router;
