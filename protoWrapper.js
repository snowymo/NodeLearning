"use strict";

var serverAddress = '192.168.1.38';	// wireless ip address
var serverPort = 1611;
var _ = require('underscore');

// UDP

var dgram = require('dgram');
var holojam = require('holojam-node')(['emitter'],'192.168.1.38');	// wireless ip

// Protobuf

var fs = require("fs");
var protobuf = require('protocol-buffers');
var updateProtoBuf = protobuf(fs.readFileSync('update_protocol_v3.proto'));

// Multicast Server

var multicastServer = dgram.createSocket('udp4');

multicastServer.on('listening', () => {
  var address = multicastServer.address();
  console.log(`multicast server listening ${address.address}:${address.port}`);
});

multicastServer.bind(serverPort, serverAddress, () => {});

multicastServer.on('error', (err) => {
	console.log(`UDP multicast server error.`);
	multicastServer.close();
});

multicastServer.on('message', (msg, rinfo) => {     
console.log("recv");
  udpToWeb(msg);
});

var motiveLabelToHolojam = {
  VR1: 'M1',
};

function udpToWeb(update) {
  // Decode JSON data.
  console.log("update:",update);

  var updateJSON = updateProtoBuf.Update.decode(update);
  var flakes = _.map(updateJSON.live_objects, (obj) => {
  var label = motiveLabelToHolojam[obj.label]||obj.label;
   console.log(obj);
   return {
	label: label,
        vector3s: [{x: -obj.x, y: obj.y, z: obj.z}],
        vector4s: [{x: -obj.qx, y: obj.qy, z: obj.qz, w: -obj.qw}],
   };
  });
  holojam.Send(holojam.BuildUpdate('motive', flakes));
}
