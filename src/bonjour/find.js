const bonjour = require('bonjour')();

var browser = bonjour.findOne({
	type: 'digicontrol',
	protocol: 'udp'
}, function() {
	console.log(browser.services)
})
browser.start();
