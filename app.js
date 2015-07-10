var http = require('http');



var server = http.createServer(function(request, response){
  console.log('got a request');
  response.write('hi');
  response.end();
});

server.listen(8080);

var io = require('socket.io').listen(server);
// Register a callback function to run when we have an individual connection
// This is run for each individual user that connects


io.sockets.on('connection',
  // We are given a websocket object in our function
  function (socket) {

    console.log("We have a new client: " + socket.id);

    socket.emit('playerShipId', socket.id);

    // When this user emits, client side: socket.emit('otherevent',some data);
    socket.on('shipInfo',
      function(data) {
        // Data comes in as whatever was sent, including objects
        //console.log("Received: 'shipInfo' from " + socket.id);

        // Send it to all other clients
        socket.broadcast.emit('shipInfo', data);

        // This is a way to send to everyone including sender
        // io.sockets.emit('message', "this goes to everyone");

      }
    );

    socket.on('disconnect', function() {
      console.log("player disconected: " + socket.id);
      socket.broadcast.emit('destroyShip', socket.id);
    });
  }
);
