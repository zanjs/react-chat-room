var express = require('express');
var app = express();

var server = app.listen(3000, function(){
		console.log("server listening at localhost:3000");
});

var io = require('socket.io')(server);

var users = [];


app.use(express.static(__dirname + '/bower_components'));
app.use(express.static(__dirname + '/client/public'));

app.get("/", function(req, res){
	res.sendFile(__dirname + "/client/index.html");
})

io.on('connection', function(socket){
  //socket.broadcast.emit("userConnected", {userId: socket.id, nick: 'anonymous'});
  users.push({userId: socket.id, nick: 'Anonymous', connected: true});

  socket.on("updateNick", function(data){
  	for(i=0; i<users.length; i++) {
  		if(users[i].userId==socket.id) {
  			users[i].nick = data.nick;
  		}
  	};
  	io.emit("updateUsers", users);
  });

  socket.on("sendMsg", function(data){
  	io.emit("msgRecieved", data);
  });

  socket.on("disconnect", function(){
  	for(i=0; i<users.length; i++) {
  		if(users[i].userId==socket.id) {
  			users[i].connected = false;
  		}
  	};
  	io.emit("updateUsers", users);
  })
});