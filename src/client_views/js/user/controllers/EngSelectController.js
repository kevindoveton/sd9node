angular.module('DigiControl.controllers').controller('EngSelectCtrl', function($scope, $state, SocketHelper, socket) {
	SocketHelper.RequestConfig();
	SocketHelper.RequestAuxNames();

	$scope.$on('socket:announcements', function(ev, data) {
		$scope.aux = [];
		console.log(data);
		data = JSON.parse(data);	
		for (var i = 1; i <= data.auxOutputs; i++) {
			$scope.aux.push({name: 'Output '+i, id: i});
		}
	});
	
	$scope.$on('socket:name/aux', function(ev, data) {
		console.log(data)
		data = JSON.parse(data);
		$scope.aux[data['a']-1].name = data['n'];
	});
	
	$scope.SelectMonitor = function (id) {
		socket.emit('engineer', id);
		SocketHelper.SoloAux(id, 1);
	}
	
});
