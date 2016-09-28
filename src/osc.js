var udp
exports.init = function(messageCallback) 
{
	var osc = require("osc")

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
	    localPort: 5050 ,
	    remoteAddress: "192.168.2.5",
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

}

exports.sendMessage = function(address, message)
{
	console.log(address, message);
	var msg = {
        address: address,
        args: [message]
    };

	udp.send(msg);
}