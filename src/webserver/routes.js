module.exports = function(app, express) {
	// static files
	app.use('/static', express.static('client_static'));

	// aux home page
	app.get('/', function (req, res) {
		res.sendFile('client_static/html/index.html' , { root : __dirname});
	});

	// all aux
	app.get('/aux/:id', function (req, res) {
		res.sendFile('client_static/html/aux.html' , { root : __dirname});
	});

	// redirect to aux home
	app.get('/aux', function (req, res) {
		res.sendFile('client_static/html/index.html' , { root : __dirname});
	});
}
