Array.prototype.subarray=function(start,end){
	if(!end){
		end=-1;
	}
	return this.slice(start, this.length+1-(end*-1));
}


angular.module('DigiControl.controllers').controller('AuxCtrl', function($scope, $state, SocketHelper,socket) {
	const AuxId = $state.params.id;
	
	SocketHelper.RequestConfig();
	SocketHelper.RequestInputNames();
	SocketHelper.RequestAuxVolume();
	
	const StepArray = [-150,-60,-58,-54,-53.5,-53,-52,-51,-50,-49,-48,-46,-45,-44,-42,-40,-38,-36,-35,-34,-33,-32,-31,-30,-29,-28,-27,-26,-25,-24,-24,-22,-21,-20,-19,-18,-17,-16,-15,-14,-13.5,-13,-12.5,-12,-11.5,-11,-10.5,-10,-9.5,-9.2,-8.8,-8.4,-7.8,-7.4,-6.9,-6.6,-6.3,-6.0,-5.75,-5.5,-5.25,-5,-4.75,-4.5,-3.25,-2.6,-2.2,-1.8,-1.5,-1.3,-1.0,-0.7,-0.4,-0.2,0,0.2,0.4,0.7,1.0,1.3,1.6,2.0,2.4,2.7,3.0,3.5,4.0,4.5,5,5.25,5.5,6.0,6.5,7.0,7.5,8.0,8.5,9.0,9.5,10];
	$scope.StepArray = StepArray;
	
	
	function SliderEnd(id, value, highValue, pointerType) {
		SocketHelper.SetAuxVolume(AuxId, id, value);
	}
	$scope.SliderEnd = SliderEnd;

	$scope.faders = [];
	
	
	// check an aux is provided
	if (AuxId == "") {
		$state.go('home');
	}
	
	$scope.$on('socket:engineer', function(ev, data) {
		$state.transitionTo($state.current, {id: data}, {
			reload: true,
			inherit: false,
			notify: true
		});
	})

	$scope.$on('socket:name/input', function (ev, data) {
		data = JSON.parse(data);
		$scope.faders[data.c-1].name = data.n;
	});
	 
	$scope.$on('socket:announcements', function (ev, data) {
		console.log(data);
		data = JSON.parse(data);
		if (data["name"] == "consoleConfig") {
			for (var i = 1; i <= data.channelInputs; i++) {
				$scope.faders.push({id: i, name: '', value: 0})
			}
		}
	});

	$scope.$on('socket:volume/aux', function (ev, data) {
		data = JSON.parse(data);
		data.v = searchArrayValues(data.v, StepArray)
			
		if (data["a"] == AuxId) {
			$scope.faders[data.c-1].value = data.v
		}
	});

	// $scope.$on('socket:name/aux', function (ev, data) {
	// $socket.on([], $scope, function(data) {
	// 	data = JSON.parse(data);
	// 	// $("#js-rangeslider-"+(data.c - 1)).find(".rangeslider__handle").first().toggleClass("mute", !!data.m);
	// 	// $("#mute-"+data.c).toggleClass("mute", !!data.m);
	// 	// $("#mute-"+data.c).toggleClass("unmute", !data.m);
	// });
	// 
	
	function searchArrayValues(value, array) {
		if (array.length == 1) {
			return array[0];
		}
		
		var index = Math.floor(array.length / 2) ;

		if (value < array[index]) {
			return searchArrayValues(value, array.slice(0, index))
		} else {
			return searchArrayValues(value, array.slice(index, array.length));
		}
	}
	
});
