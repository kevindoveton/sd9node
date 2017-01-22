$(function() {
	var socket = io.connect();

	socket.on('connect', function() {
		// Connected, let's sign-up to receive messages for this room
		socket.emit('subscribe', "announcements");
		socket.emit('subscribe', "name/aux");
		socket.emit("request", "auxNames");
	});

	socket.on('announcements', function (data) {
		data = JSON.parse(data);
		console.log(data);
		createButtons(data);
	});

	socket.on('name/aux', function (data) {
		data = JSON.parse(data);
		updateName(data["a"], data["n"]);
	});
});
