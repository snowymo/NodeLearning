"use strict";

var serverAddress = '192.168.1.38';	// wireless ip address
var serverPort = 1611;
var _ = require('underscore');

// UDP

var dgram = require('dgram');
var holojam = require('holojam-node')(['emitter'],'192.168.1.38');	// wireless ip

// Protobuf

//var fs = require("fs");
//var protobuf = require('protocol-buffers');
//var updateProtoBuf = protobuf(fs.readFileSync('update_protocol_v3.proto'));

// Multicast Server

var multicastServer = dgram.createSocket('udp4');

multicastServer.on('listening', () => {
  var address = multicastServer.address();
  console.log(`multicast server listening ${address.address}:${address.port}`);
});

multicastServer.bind(serverPort, serverAddress);

multicastServer.on('error', (err) => {
	console.log('UDP multicast server error.');
	multicastServer.close();
});

multicastServer.on('message', (msg, rinfo) => {     
console.log("recv", Date.now());
  udpToWeb(msg);
});

var motiveLabelToHolojam = {
  VR1: 'M1',
};

function readString(data, index){// parse for extra data as a string ended with '='
  var extraData = "";
  var st = "";
  while(st != '='){
    st = data.toString('ascii', index, ++index);
    if( st != "=" ){
      extraData += st;
    }
  }
  return {extra: extraData, idx: index};
}

function bin2json(data){

  var jsonObjs =[];
  var jsonIdx = 0;
  if (data.length < 7){
    return jsonObjs;
  }
  
  var index = 6;
  var dataLabel = data.toString('ascii',0,index);
  if (dataLabel != "motive"){
    return jsonObjs;
  }

  while(index < data.length){
    // [size of label][label][xyz][qxqyqzqw][tracking valid][button bits][string][=]  
    var curObj = {};
    var sizeOfLabel = data.readInt16LE(index);
    index += 4;
    //console.log("size of label", sizeOfLabel);
    var liveobjLabel = data.toString('ascii',index,index+sizeOfLabel);
    index += sizeOfLabel;
    //console.log(liveobjLabel);
    
    curObj = {
      label: liveobjLabel,
      vector3s: [{x: -data.readFloatLE(index), y:data.readFloatLE(index+4), z: data.readFloatLE(index+8)}],
      //vector3s: [{x: -5, y: -5, z:-5}],
      vector4s: [{x: -data.readFloatLE(index+12), y:data.readFloatLE(index+16), z: data.readFloatLE(index+20), w: -data.readFloatLE(index+24)}],
      //vector4s: [{x: 1, y: 0, z:1, w:0}],
      ints: [],
    };
    index += 28;
    var valid = data.readInt8(index++) - 48;
    var buttonbits = data.readInt32LE(index);
    curObj.ints[0] = buttonbits;
    // debug
    index += 4;
    var extraData = readString(data, index);
    index = extraData.idx;
    //console.log("idx", index, data[index]);
    var delta = Date.now() % 1000 - curObj.ints[0];
    if (delta < 0) delta += 1000;
    if( liveobjLabel == "M2LH")
      console.log("cur obj " + curObj.vector3s[0].y +" " + curObj.ints[0] + " " + Date.now() % 1000 + "\t" + delta);
    jsonObjs[jsonIdx++] = curObj;
  }
  return jsonObjs;
}

function udpToWeb(update) {
  // Decode JSON data.
  //console.log("update:",update);

  var liveObjs = bin2json(update);
  
  //console.log("liveobjs:",liveObjs);
 /* 
  var updateJSON = updateProtoBuf.Update.decode(update);
  var flakes = _.map(updateJSON.live_objects, (obj) => {
  var label = motiveLabelToHolojam[obj.label]||obj.label;
   console.log(label);
   return {
	label: label,
        triples: [{x: obj.x, y: obj.y, z: obj.z}],
        quads: [{x: obj.qx, y: obj.qy, z: obj.qz, w: obj.qw}],
   };
  });*/
  holojam.Send(holojam.BuildUpdate('motive', liveObjs));
}
