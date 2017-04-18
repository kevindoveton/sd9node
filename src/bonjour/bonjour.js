const bonjour = require('bonjour')();



module.exports = function(port) {
	const options = {
		name: 'DigiControl',
		port: port,
		type: 'digicontrol',
		protocol: 'udp',
	}
	
	var service = bonjour.publish(options)
	service.start();
	console.log('Bonjour Started')
	// console.log(service.type, service.port);
}
