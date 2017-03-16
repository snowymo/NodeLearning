var net = require('net');

var server = net.createServer();  
server.on('connection', handleConnection);

var publisher = {
  host: '192.168.1.44',
  port: 80,
  //exclusive: true
}

 server.listen(5565, function() {  
   console.log('server listening to %j', server.address());
 });
//server.listen('192.168.1.44');
//server.listen(1337, '127.0.0.1');


function handleConnection(conn) {  
  var remoteAddress = conn.remoteAddress + ':' + conn.remotePort;
  console.log('new client connection from %s', remoteAddress);

  conn.setEncoding('utf8');

  conn.on('data', onConnData);
  conn.once('close', onConnClose);
  conn.on('error', onConnError);

  function onConnData(d) {
    console.log('connection data from %s: %j', remoteAddress, d);
    conn.write(d.toUpperCase());
  }

  function onConnClose() {
    console.log('connection from %s closed', remoteAddress);
  }

  function onConnError(err) {
    console.log('Connection %s error: %s', remoteAddress, err.message);
  }
}