module.exports = function(app, io, CursorPosition) {

	var clients = {};

	app.post('/start', function(req,res) {
		clients[req.body.clientid] = true;		

		console.log("Received START from Client: " + req.body.clientid);
	});

	app.post('/stop', function(req,res) {
		clients[req.body.clientid] = false;		

		console.log("Received STOP from Client: " + req.body.clientid);
	});

	io.sockets.on('connection', function (socket) {
		socket.on('cursor', function (data) {
			if(clients[socket.id] != null && clients[socket.id] == true) {
				new CursorPosition({ clientId: socket.id, posX: data.posX, posY: data.posY, date: new Date() }).save();
				console.log("SAVING - Mouse X: " + data.posX + " Mouse Y: " + data.posY);
			}
		});
	});
}