// Get the packages we need
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

// Create our Express application
var app = express();

// Start the server and export the server.
var server = module.exports = app.listen(3000);

// Include socket-io by passing server instance.
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

// Register all our routes with /api.
// require is done at this point due to server instance needs to be created.
var donatorsRoutes = require('./api/controllers');

app.use('/api', donatorsRoutes);
app.use('/', express.static(__dirname + '/../public'));

console.log('Server running ' + port);
