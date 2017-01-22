var udp;
var osc = require("osc");

var sd9Console = {
	"Console" : {
		"Input_Channels" : 6,
		"Aux_Outputs" : 4
	},

	"Input_Channels" : [
		{
			"Channel_Input" : {
				"name" : "channel 1 yo",
			},

			"Aux_Send" : [
				{ // aux 1 send
					"send_level" : -30,
				},
				{ // aux 2 send
					"send_level" : -15,
				},
				{ // aux 3 send
					"send_level" : -0,
				},
				{ // aux 4 send
					"send_level" : -21,
				},
			]
		},
		{
			"Channel_Input" : {
				"name" : "ch 2",
			},

			"Aux_Send" : [
				{ // aux 1 send
					"send_level" : -64,
				},
				{ // aux 2 send
					"send_level" : -21,
				},
				{ // aux 3 send
					"send_level" : -0,
				},
				{ // aux 4 send
					"send_level" : -150,
				},
			]
		},
		{
			"Channel_Input" : {
				"name" : "ch 3",
			},

			"Aux_Send" : [
				{ // aux 1 send
					"send_level" : -53,
				},
				{ // aux 2 send
					"send_level" : -72,
				},
				{ // aux 3 send
					"send_level" : -21,
				},
				{ // aux 4 send
					"send_level" : -3,
				},
			]
		},
		// channel 4
		{
			"Channel_Input" : {
				"name" : "ch 4",
			},

			"Aux_Send" : [
				{ // aux 1 send
					"send_level" : -55,
				},
				{ // aux 2 send
					"send_level" : -9,
				},
				{ // aux 3 send
					"send_level" : -31,
				},
				{ // aux 4 send
					"send_level" : -11,
				},
			]
		},
		// channel 4
		{
			"Channel_Input" : {
				"name" : "ch 5",
			},

			"Aux_Send" : [
				{ // aux 1 send
					"send_level" : -55,
				},
				{ // aux 2 send
					"send_level" : -9,
				},
				{ // aux 3 send
					"send_level" : -31,
				},
				{ // aux 4 send
					"send_level" : -11,
				},
			]
		},
		// channel 4
		{
			"Channel_Input" : {
				"name" : "ch 6",
			},

			"Aux_Send" : [
				{ // aux 1 send
					"send_level" : -55,
				},
				{ // aux 2 send
					"send_level" : -9,
				},
				{ // aux 3 send
					"send_level" : -31,
				},
				{ // aux 4 send
					"send_level" : -11,
				},
			]
		}
	],

	"Aux_Outputs" : [
		{ // aux 1
			"Buss_Trim" : {
				"name" : "aux 1/bass",
			},
		},
		{ // aux 2
			"Buss_Trim" : {
				"name" : "aux 2",
			},
		},
		{ // aux 3
			"Buss_Trim" : {
				"name" : "aux 3",
			},
		},
		{ // aux 4
			"Buss_Trim" : {
				"name" : "aux 4",
			},
		},
	],
};

var messageCallback = function(message)
{
	// get the address and message from the osc message
	var address = message.address;
	var msg = message.args[0]

	var patt;

	// check if input_name name
	patt = new RegExp(/(\/Input_Channels\/)[0-9]*(\/Channel_Input\/name)/, '');
	if (patt.test(address))
	{
		split = address.split("/");
		// set
		if (address.slice(-1) !== "?")
		{
			try {
				sd9Console[split[1]][split[2]-1][split[3]][split[4]] = msg;
			}
			catch (err) {

			}
		}

		else
		{
			try {
				sendMessage(address.slice(0,-2), sd9Console[split[1]][split[2]-1][split[3]][split[4]]);
			}
			catch (err) {

			}
		}

	}
	// check if aux name
	patt = new RegExp(/(\/Aux_Outputs\/)[0-9]*(\/Buss_Trim\/name)/, '');
	if (patt.test(address))
	{
		split = address.split("/");
		console.log(split);
		if (address.slice(-1) !== "?")
		{
			if (sd9Console[split[1]][split[2]-1][split[3]][split[4]] != undefined)
				sd9Console[split[1]][split[2]-1][split[3]][split[4]] = msg;
		}
		else
		{
			if (sd9Console[split[1]][split[2]-1][split[3]][split[4]] != undefined)
				sendMessage(address.slice(0,-2), sd9Console[split[1]][split[2]-1][split[3]][split[4]]);
		}

	}

	// check if input aux volume
	patt = new RegExp(/(\/Input_Channels\/)[0-9]*(\/Aux_Send\/)[0-9]*(\/send_level)/, '');
	if (patt.test(address))
	{
		split = address.split("/");
		if (address.slice(-1) !== "?")
		{
			try {
				sd9Console[split[1]][split[2]-1][split[3]][split[4]-1][split[5]] = msg;
			}
			catch (err) {

			}

		}
		else
		{
			try {
				sendMessage(address.slice(0,-2), sd9Console[split[1]][split[2]-1][split[3]][split[4]-1][split[5]]);
			}
			catch (err) {

			}
		}
	}

	patt = new RegExp(/(\/Console\/Aux_Outputs\/\?)/, '');
	if (patt.test(address))
	{
		try {
			sendMessage(address.slice(0,-2), sd9Console["Console"]["Aux_Outputs"]);
		}
		catch (err) {

		}
	}

	patt = new RegExp(/(\/Console\/Input_Channels\/\?)/, '');
	if (patt.test(address))
	{
		try {
			console.log("a");
			sendMessage(address.slice(0,-2), sd9Console["Console"]["Input_Channels"]);
		}
		catch (err) {

		}
	}
};



var getIPAddresses = function () {
	var os = require("os"),
		interfaces = os.networkInterfaces(),
		ipAddresses = [];

	for (var deviceName in interfaces) {
		var addresses = interfaces[deviceName];
		for (var i = 0; i < addresses.length; i++) {
			var addressInfo = addresses[i];
			if (addressInfo.family === "IPv4" && !addressInfo.internal) {
				ipAddresses.push(addressInfo.address);
			}
		}
	}

	return ipAddresses;
};

// SD9 Server
udp = new osc.UDPPort({
	localAddress: "0.0.0.0",
	localPort: 5050,
	remoteAddress: "127.0.0.1",
	remotePort: 6050
});

udp.on("ready", function () {
	var ipAddresses = getIPAddresses();
	console.log("Listening for OSC over UDP.");
	ipAddresses.forEach(function (address) {
		console.log(" Host:", address + ", Port:", udp.options.localPort);
	});
	console.log("Broadcasting OSC over UDP to", udp.options.remoteAddress + ", Port:", udp.options.remotePort);
});

udp.on("message", function (oscMessage) {
	messageCallback(oscMessage);
});

udp.on("error", function (err) {
	console.log(err);
});

udp.open();


var sendMessage = function(address, message)
{
	var msg = {
		address: address,
		args: [message]
	};

	udp.send(msg);
}
