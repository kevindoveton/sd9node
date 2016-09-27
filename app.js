var express = require('express');
var app = express()
var server = require('http').createServer(app);  
var io = require('socket.io')(server);


// routes
var routes = require("./routes.js");
routes(app, express);

var consoleConfig = {
	"name":"consoleConfig",
	"channelInputs" : 4,
	"auxOutputs" : 4
}

var osc = require("./osc.js");

var oscMessageCallback = function(message)
{
	// get the address and message from the osc message
	var address = message.address;
	var msg = message.args[0]

	// input channel name
	var patt = new RegExp(/(\/Input_Channels\/)[0-9]*(\/Channel_Input\/name)/, '');
	if (patt.test(address))
	{
		console.log("input channel name");
		inputNameCallback(address, msg);
	}

	// input channel aux volume
	patt = new RegExp(/(\/Input_Channels\/)[0-9]*(\/Aux_Send\/)[0-9]*(\/send_level)/, '');
	if (patt.test(address))
	{
		console.log("input channel aux volume");
		auxVolumeCallback(address, msg);
	}

	// aux name
	patt = new RegExp(/(\/Aux_Outputs\/)[0-9]*(\/Buss_Trim\/name)/, '');
	if (patt.test(address))
	{
		console.log("aux channel name");
		auxNameCallback(address, msg);
	}

}

// initialise osc
osc.init(oscMessageCallback);

var requestInputNameUpdate = function()
{
	for (i = 1; i <= consoleConfig["channelInputs"]; i++)
	{
		osc.sendMessage("/Input_Channels/"+i+"/Channel_Input/name/?", "");
	}
}

var requestAuxNameUpdate = function()
{
	for (i = 1; i <= consoleConfig["auxOutputs"]; i++)
	{
		osc.sendMessage("/Aux_Outputs/"+i+"/Buss_Trim/name/?", "")
	}
}

var requestInputLevelUpdate = function(auxnumber)
{
	for (i = 1; i <= consoleConfig["channelInputs"]; i++)
	{
		osc.sendMessage("/Input_Channels/"+i+"/Aux_Send/"+auxnumber+"/send_level/?", "")
	}
}

var auxVolumeCallback = function(address, message)
{
	var channel = address.split("/Input_Channels/")[1].split("/Aux_Send/")[0];
	var auxSend = address.split("/Input_Channels/")[1].split("/Aux_Send/")[1].split("/send_level")[0];
	var volume = message;
	var obj = {
		"a":auxSend,
		"c":channel,
		"v":volume
	};
	io.sockets.in("volume/aux/"+auxSend).emit("volume/aux", JSON.stringify(obj));
}

var inputNameCallback = function(address, message)
{
	var channel = address.split("/Input_Channels/")[1].split("/Channel_Input/name")[0];
	var name = message;
	var obj = {
		"c":channel,
		"n":name
	};

	io.sockets.in("name/input").emit("name/input", JSON.stringify(obj));
}

var auxNameCallback = function(address, message)
{
	var auxNumber = address.split("/Aux_Outputs/")[1].split("/Buss_Trim/name")[0]
	var name = message;
	var obj = {
		"a":auxNumber,
		"n":name
	};
	// io.sockets.emit("announcements","message");
	io.sockets.to("name/aux").emit("name/aux", JSON.stringify(obj));
}

var updateAuxVolume = function(auxNumber, channel, volume)
{
	address = "/Input_Channels/"+(channel)+"/Aux_Send/"+(auxNumber)+"/send_level";
	osc.sendMessage(address, volume);
}

// server
server.listen(8000);

// handle incoming connections from clients
io.sockets.on('connection', function(socket) {
	socket.emit("announcements", JSON.stringify(consoleConfig));

	// once a client has connected, we expect to get a ping from them saying what room they want to join
	socket.on('subscribe', function(room) {
		socket.join(room);
	});

	socket.on("volume/aux", function(data) {
		_data = JSON.parse(data);
		socket.broadcast.to("volume/aux/"+_data["a"]).emit("volume/aux", data);
		updateAuxVolume(_data["a"], _data["c"], _data["v"]);
	});

	socket.on("request", function(data) {
		if (data == "auxNames")
			requestAuxNameUpdate();
		else if (data == "inputNames")
			requestInputNameUpdate();
		else if (data.substr(0,19) == "inputAuxLevelVolume")
			requestInputLevelUpdate(data.substr(19));
	});

});




