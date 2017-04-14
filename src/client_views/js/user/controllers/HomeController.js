angular.module('DigiControl.controllers').controller('HomeCtrl', function($scope, $state, SocketHelper) {

	SocketHelper.RequestConfig();
	SocketHelper.RequestAuxNames();
	
	$scope.$on('socket:announcements', function (ev, data) {
		$scope.aux = [];
		data = JSON.parse(data);	
		for (var i = 1; i <= data.auxOutputs; i++) {
			$scope.aux.push({name: 'Output '+i, id: i});
		}
	});
	
	$scope.$on('socket:name/aux', function (ev, data) {
		data = JSON.parse(data);
		console.log(data);
		$scope.aux[data['a']-1].name = data['n'];
	});
});
