var fs = require('fs');
const options = {
	key: fs.readFileSync('./keys/key.pem'),
	cert: fs.readFileSync('./keys/cert.pem')
};

let express = require('express');
let app = express();
var server = require('https').createServer(options, app);
server.listen(8080, function(){
    console.log("Server Started at :8080");
});
var server2 = require('http').createServer(app);
	server2.listen(80, function(){
});

var io = require('socket.io').listen(server);
var io2 = require('socket.io').listen(server2);

let canvasData;

app.use('/css', express.static(__dirname + '/css'));
app.use('/js', express.static(__dirname + '/js'));
app.use('/res', express.static(__dirname + '/res'));

app.get('/', function(req, res) {
   res.sendFile(__dirname + '/views/projection.html');
});

app.get('/canvas1', function(req, res) {
   res.sendFile(__dirname + '/views/canvas1.html');
});

app.get('/canvas2', function(req, res) {
   res.sendFile(__dirname + '/views/canvas2.html');
});

app.get('/canvas3', function(req, res) {
   res.sendFile(__dirname + '/views/canvas3.html');
});

app.get('/canvas4', function(req, res) {
   res.sendFile(__dirname + '/views/canvas4.html');
});

app.get('/canvas5', function(req, res) {
   res.sendFile(__dirname + '/views/canvas5.html');
});

// app.get('/canvas10', function(req, res) {
// 	res.sendFile(__dirname + '/views/canvas10.html');
// });

app.get('/projection', function(req, res) {
   res.sendFile(__dirname + '/views/projection.html');
});

app.get('/camera', function(req, res) {
   res.sendFile(__dirname + '/views/camera.html');
});

io.on('connection', function(socket){
    console.log('a user connected', socket.id);
    socket.broadcast.to(socket.id).emit('drawing', canvasData);

    socket.on('disconnect', function(){
        console.log('user disconnected');
    });

    socket.on('ready', function(msg) {
       console.log(msg);
    });

    socket.on('drawing1', function (canvasJson) {
       console.log("Drawing1");
       canvasData = canvasJson;
       socket.broadcast.emit('drawing1', canvasData);
    });

    socket.on('drawing2', function (canvasJson) {
       console.log("Drawing2");
       canvasData = canvasJson;
       socket.broadcast.emit('drawing2', canvasData);
    });

    socket.on('drawing3', function (canvasJson) {
       console.log("Drawing3");
       canvasData = canvasJson;
       socket.broadcast.emit('drawing3', canvasData);
    });

		socket.on('drawing4', function (canvasJson) {
       console.log("Drawing4");
       canvasData = canvasJson;
       socket.broadcast.emit('drawing4', canvasData);
    });

		socket.on('drawing5', function (canvasJson) {
			 console.log("Drawing5");
			 canvasData = canvasJson;
			 socket.broadcast.emit('drawing5', canvasData);
		});

		socket.on('drawingProjection', function (canvasJson) {
			 console.log("DrawingProjection");
			 canvasData = canvasJson;
			 socket.broadcast.emit('drawingProjection', canvasData);
		});

		socket.on('position1', function (data) {
			 console.log(data.x);
			 socket.broadcast.emit('position1', data);
		});

		socket.on('position2', function (data) {
			 // console.log("Position2");
			 socket.broadcast.emit('position2', data);
		});

		socket.on('markerStamp', function (data) {
			 socket.broadcast.emit('markerStamp', data);
		});

		socket.on('groupInfo1', function (data) {
			 socket.broadcast.emit('groupInfo1', data);
		});

		socket.on('groupInfo2', function (data) {
			 socket.broadcast.emit('groupInfo2', data);
		});

		socket.on('groupInfo3', function (data) {
			 socket.broadcast.emit('groupInfo3', data);
		});

		socket.on('groupInfo4', function (data) {
			 socket.broadcast.emit('groupInfo4', data);
		});

		socket.on('groupInfo5', function (data) {
			 socket.broadcast.emit('groupInfo5', data);
		});
});

// http.listen(8080, function(){
//     console.log('listening on *:8080');
// });
