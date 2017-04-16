angular.module('DigiControl').factory('SocketHelper', function(socket) {
	socket.on('connect', function() {
		socket.emit('subscribe', "announcements");
		socket.emit('subscribe', 'engineer');
		socket.emit('subscribe', 'name/input')
		socket.emit('subscribe', 'name/aux')
		socket.emit('subscribe', "volume/aux");
		socket.emit('subscribe', "mute/input");
	});
	
	
	// request input mutes
	// setInterval(function() {
	// 	socket.emit("request", "inputMutes");
	// }, 20000);
	
	return {
		RequestConfig: function() {	
			socket.emit('request', 'consoleConfig')
		},
		
		RequestAuxVolume: function() {
			socket.emit('request', 'inputAuxLevelVolume');
		},
		
		RequestInputNames: function() {
			socket.emit('subscribe', 'name/input')
			socket.emit('request', 'inputNames')
		},
		
		RequestAuxNames: function() {
			socket.emit('request', 'auxNames')
		},
		
		SetAuxVolume: function(aux, channel, volume) {
			socket.emit('volume/aux', JSON.stringify({a:aux, c:channel, v:volume}))
		},
		
		SoloAux: function(aux, value) {
			socket.emit('auxsolo', aux);
		}
	};
});
