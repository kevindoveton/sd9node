const bonjour = require('bonjour')();

var browser = bonjour.findOne({
	name: 'DigiControl',
	protocol: 'udp'
}, function() {
	console.log(browser.services)
})
browser.start();
