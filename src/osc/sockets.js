const oscFunctions = require('./oscFunctions');

// TODO request this from console...
// or use the desk layout??
var consoleConfig = {
	"name" : "consoleConfig",
	"channelInputs" : 40,
	"auxOutputs" : 12
};

var io;

module.exports = function(server) {
	if ((server !== null) || (server !== undefined)) {
		io = require('socket.io')(server);
	}

	this.init = function() {
		// handle incoming connections from clients
		io.sockets.on('connection', function(socket) {

			// once a client has connected, we expect to get a ping from them saying what room they want to join
			socket.on('subscribe', function(room) {
				socket.join(room);
			});

			socket.on("volume/aux", function(data) {
				var _data = JSON.parse(data);
				socket.broadcast.to("volume/aux/"+_data["a"]).emit("volume/aux", data);
				oscFunctions.updateAuxVolume(_data["a"], _data["c"], _data["v"]);
			});
			
			socket.on("engineer", function(data) {
				groupEmit('engineer', data)
				// socket.broadcast.to("engineer").emit("engineer", data);
			});

			// client has requested updates
			socket.on("request", function(data) {
				if (data == "auxNames") {
					oscFunctions.requestAuxNameUpdate(1, consoleConfig['auxOutputs']);
				}
				else if (data == "inputNames") {
					oscFunctions.requestInputNameUpdate(1, consoleConfig['channelInputs']);
				}
				else if (data == "consoleConfig") {
					oscFunctions.requestConsoleUpdate();
				}
				else if (data == "inputMutes") {
					oscFunctions.requestInputMuteUpdate(1, 1, consoleConfig['channelInputs']);
				}
				else if (data.substr(0,19) == "inputAuxLevelVolume") {
					oscFunctions.requestInputLevelUpdate(data.substr(19), 1, consoleConfig['channelInputs']);
				}
			});
			
			socket.on('disconnect', function(data) {
				socket.emit('disconnect');
				socket.disconnect();
			});

			// once connected and rooms joined, send some settings
			socket.emit("announcements", JSON.stringify(consoleConfig));
		});
	}

	this.groupEmit = function(group, data) {
		io.sockets.in(group).emit(group, data);
	}

	this.init();
	return this;
}
