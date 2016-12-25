const osc = require("./osc");
const oscFunctions = require('./oscFunctions');
const socket = require('./sockets')();

exports.cb = function(message)
{
	// get the address and message from the osc message
	var address = message.address;
	var msg = message.args[0]

	// input channel name
	var patt = new RegExp(/(\/Input_Channels\/)[0-9]*(\/Channel_Input\/name)/, '');
	if (patt.test(address))
	{
		inputNameCallback(address, msg);
	}

	// input channel aux volume
	patt = new RegExp(/(\/Input_Channels\/)[0-9]*(\/Aux_Send\/)[0-9]*(\/send_level)/, '');
	if (patt.test(address))
	{
		auxVolumeCallback(address, msg);
	}

	// input channel mute
	console.log(address);
	patt = new RegExp(/(\/Input_Channels\/)[0-9]*(\/mute)/, '');
	if (patt.test(address))
	{
		inputMuteCallback(address, msg);
	}

	// aux name
	patt = new RegExp(/(\/Aux_Outputs\/)[0-9]*(\/Buss_Trim\/name)/, '');
	if (patt.test(address))
	{
		auxNameCallback(address, msg);
	}

	// Console Config
	// patt = new RegExp(/(\/Console\/Input_Channels)/, '');
	// if (patt.test(address))
	// {
	// 	if (consoleConfig["channelInputs"] != msg)
	// 	{
	// 		consoleConfig["channelInputs"] = msg;
	// 		socket.groupEmit("announcements", JSON.stringify(consoleConfig));
	// 	}
	// }
	//
	// patt = new RegExp(/(\/Console\/Aux_Outputs)/, '');
	// if (patt.test(address))
	// {
	// 	if (consoleConfig["auxOutputs"] != msg)
	// 	{
	// 		consoleConfig["auxOutputs"] = msg;
	// 		socket.groupEmit("announcements", JSON.stringify(consoleConfig));
	// 	}
	// }

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

	socket.groupEmit("volume/aux/"+auxSend, JSON.stringify(obj));
}

var inputNameCallback = function(address, message)
{
	var channel = address.split("/Input_Channels/")[1].split("/Channel_Input/name")[0];
	var name = message;
	var obj = {
		"c":channel,
		"n":name
	};

	socket.groupEmit("name/input", JSON.stringify(obj));
}

var inputMuteCallback = function(address, message)
{
	console.log(address);
	var channel = address.split("/Input_Channels/")[1].split("/mute")[0];
	console.log(channel);
	var mute = message
	var obj = {
		"c":channel,
		"m":mute
	};

	socket.groupEmit("mute/input", JSON.stringify(obj));
}

var auxNameCallback = function(address, message)
{
	var auxNumber = address.split("/Aux_Outputs/")[1].split("/Buss_Trim/name")[0]
	var name = message;
	var obj = {
		"a":auxNumber,
		"n":name
	};

	socket.groupEmit("name/aux", JSON.stringify(obj));
}

var updateAuxVolume = function(auxNumber, channel, volume)
{
	address = "/Input_Channels/"+(channel)+"/Aux_Send/"+(auxNumber)+"/send_level";
	osc.sendMessage(address, volume);
}
