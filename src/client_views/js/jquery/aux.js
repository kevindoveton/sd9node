var socket = io.connect();

$(function() {
	var auxnumber = window.location.pathname.substring(5).replace ( /[^\d.]/g, '' )
	$("#auxName").text("Aux " + auxnumber);

	socket.on('connect', function() {
		socket.emit("request", "consoleConfig");
		socket.emit('subscribe', "announcements");
		socket.emit('subscribe', "name/input");
		socket.emit('subscribe', "name/aux");
		socket.emit('subscribe', "volume/aux/"+auxnumber);
		socket.emit('subscribe', "mute/input");
		socket.emit("request", "inputAuxLevelVolume"+auxnumber);
		socket.emit("request", "inputNames");
		socket.emit("request", "auxNames");
		socket.emit("request", "inputMutes");
	});

	setInterval(function() {
		socket.emit("request", "inputMutes");
	}, 20000);

	socket.on('announcements', function (data) {
		data = JSON.parse(data);
		if (data["name"] == "consoleConfig") {
			createFaders(data["channelInputs"]);
		}
	});

	socket.on('name/input', function (data) {
		data = JSON.parse(data);
		console.log(data);
		updateFaderName(data["c"], data["n"]);
	});

	socket.on('name/aux', function (data) {
		// console.log('Incoming message:', data);
		if (auxnumber == data["a"]) {
			$("#auxName").text(data["n"])
		}
	});

	socket.on('volume/aux', function (ev, data) { // +auxnumber may not be needed
		data = JSON.parse(data);

		if (data["a"] == auxnumber) {
			updateFaderLevel(data["c"], data["v"]);
		}
	});

	socket.on('mute/input', function(data) {
		data = JSON.parse(data);
		$("#js-rangeslider-"+(data.c - 1)).find(".rangeslider__handle").first().toggleClass("mute", !!data.m);
		// $("#mute-"+data.c).toggleClass("mute", !!data.m);
		// $("#mute-"+data.c).toggleClass("unmute", !data.m);
	});

	screenSizeUpdate();
});
