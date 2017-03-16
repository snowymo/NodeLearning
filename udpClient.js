var sleep = require('sleep');


var PORT = 8888;
var HOST = '192.168.1.164';

var dgram = require('dgram');
var message = new Buffer('test!');

var client = dgram.createSocket('udp4');

var curDate;

function callback(err, bytes){
	if (err) {
		client.close();
		throw err;
	}

    console.log('UDP message sent to ' + HOST +':'+ PORT);

	//sleep.sleep(1); // sleep for ten seconds
    //client.close();
}

function sendMsg(){
	curDate = Date.now();
	//console.log('before ' + curDate);
	client.send(message, 0, message.length, PORT, HOST, callback);	
}

client.on('message', function (message, remote) {
    console.log(remote.address + ':' + remote.port +' - ' + message);
    var newDate = Date.now();
	console.log('after ' + newDate);
	var delta = newDate - curDate;
	console.log('delta ', delta);
});

setInterval(sendMsg, 500);
