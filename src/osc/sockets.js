const oscFunctions = require('./oscFunctions');

// TODO request this from console...
// or use the desk layout??
var consoleConfig = {
	"name" : "consoleConfig",
	"channelInputs" : 48,
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
				socket.broadcast.to("volume/aux").emit("volume/aux", data);
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
					// oscFunctions.requestConsoleUpdate();
					socket.emit("announcements", JSON.stringify(consoleConfig));
				}
				else if (data == "inputMutes") {
					oscFunctions.requestInputMuteUpdate(1, 1, consoleConfig['channelInputs']);
				}
				else if (data == "inputAuxLevelVolume") {
					for (var i = 1; i <= consoleConfig['auxOutputs']; i++) {
						oscFunctions.requestInputLevelUpdate(i, 1, consoleConfig['channelInputs']);
					}
				}
			});
			
			socket.on('auxsolo', function(data) {
				oscFunctions.auxSolo(data, 1);
			})
			
			// once connected and rooms joined, send some settings
			// socket.emit("announcements", JSON.stringify(consoleConfig));
		});
	}

	this.groupEmit = function(group, data) {
		// io.to(group).emit(data);

		// io.sockets.in('announcements').emit('announcements', data);
		console.log(group, data)
		io.sockets.in(group).emit(group, data);
	}

	this.init();
	return this;
}
