// receive data from holojam relay and send three floats to python through udp

var PORT = 8888;
var HOST = '192.168.1.38';

var dgram = require('dgram');

var client = dgram.createSocket('udp4');

const holojam = require('holojam-node')(['sink']);

holojam.on('update', (flakes, scope, origin) => {
  console.log(
    'Update received with ' + flakes.length
      + ' ' + (flakes.length == 1 ? 'flake' : 'flakes') + ':'
  );

  flakes.forEach((flake) => {
    //console.log('  ' + scope + '.' + flake.label + ":pos:" + flake.vector3s[0].x);
    if(flake.label == 'M2LH'){//roomba
      var buf = Buffer.allocUnsafe(12);// x: go speed y: turn speed z: time
      buf.writeFloatLE(flake.vector3s[0].x,0);
      buf.writeFloatLE(flake.vector3s[0].y,4);
      buf.writeFloatLE(flake.vector3s[0].z,8);
      
      client.send(buf, 0, buf.length, PORT, HOST, callback);    
    }
    
    if(flake.bytes.length > 0){
      console.log('    ' + flake.bytes);
    }
  });

  // var message = new Buffer(flakes);
  // console.log("flakes", message);
  // client.send(message, 0, message.length, PORT, HOST, callback);  
});

function callback(err, bytes){
  if (err) {
    client.close();
    throw err;
  }

  console.log('UDP message sent to ' + HOST +':'+ PORT);

  //sleep.sleep(1); // sleep for ten seconds
    //client.close();
}