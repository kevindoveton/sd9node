angular.module('DigiControl.controllers').controller('EngSelectCtrl', function($scope, $state, socket) {
	
	socket.on('connect', function() {
		// Connected, let's sign-up to receive messages for this room
		socket.emit('subscribe', "announcements");
		socket.emit('subscribe', "name/aux");
		
		// request all aux names
		socket.emit("request", "auxNames");
	});
	
	socket.on('announcements', function (data) {
		$scope.aux = [];
		data = JSON.parse(data);	
		for (var i = 1; i <= data.auxOutputs; i++) {
			$scope.aux.push({name: 'Output '+i, id: i});
		}
	});
	
	socket.on('name/aux', function (data) {
		data = JSON.parse(data);
		console.log(data);
		$scope.aux[data['a']-1].name = data['n'];
	});
	
	$scope.SelectMonitor = function (id) {
		socket.emit('engineer', id);
	}
	
});
