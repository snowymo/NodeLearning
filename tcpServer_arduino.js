// example of tcp server

var net = require('net');

// Keep track of the chat clients
var clients = [];

var server = net.createServer();  
server.on('connection', handleConnection);

server.listen(9000, function() {  
  console.log('server listening to %j', server.address());
});

function handleConnection(conn) {  
  var remoteAddress = conn.remoteAddress + ':' + conn.remotePort;
  if (clients.indexOf(conn) != -1){
    clients.push(conn);
    console.log('new client connection from %s', remoteAddress);

   // Send a nice welcome message and announce
    var success = conn.write("Welcome " + conn.name + "\r");
    console.log("success:",success);
  }
  // broadcast(socket.name + " joined the chat\n", conn);

  conn.on('data', onConnData);
  conn.once('close', onConnClose);
  conn.on('error', onConnError);

  function onConnData(d) {
    console.log('connection data from %s: %j', remoteAddress, d.toString());
    console.log('date there',d.toString());
    console.log('date now',Date.now());
    //conn.write(d);
    var date = Date.now();
    conn.write("date:" + date + "\r");
  }

  function onConnClose() {
    console.log('connection from %s closed', remoteAddress);
  }

  function onConnError(err) {
    console.log('Connection %s error: %s', remoteAddress, err.message);
  }
}