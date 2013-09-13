var express = require('express')
  , app = express()  
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server)
  , mongoose = require('mongoose')
  , CursorPosition = require('./mongo-item.js')(mongoose);

mongoose.connect(process.env.MONGO_DEVELOPMENT_URI); 

app.engine('html', require('ejs').renderFile);
app.use(express.bodyParser());

// express routes
var index = require('./index-route.js')(app)  
  , start = require('./start-route.js')(app, io, CursorPosition);


server.listen(8080);

io.sockets.on('connection', function (socket) {
  socket.emit('client', { clientId: socket.id });

  socket.on('cursor', function (data) {
    socket.broadcast.emit('cursor', data); // broadcast mouse position to other clients   
    console.log("Mouse X: " + data.posX + " Mouse Y: " + data.posY);
  });

  socket.on('play', function (data) {
    console.log("Received PLAY from Client: " + socket.id);
    
    CursorPosition.find({ clientId: socket.id}, function(err, docs){
      if (err) console.log('No records for client: ' + socket.id);
      else {
        console.log('Records found for client: ' + socket.id + ' - ' + docs.length + ' records');

        docs.forEach(function(doc) {
          console.log('Emiting CursorPosition(X): ' + doc.posX + ' - (Y): ' + doc.posY);
          socket.emit('play', doc);
        });

      }      
    });

  });

});