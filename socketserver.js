var express = require('express');
var app = express();
var http = require('http').Server(app);
var net = require('net');
var mongoose = require('mongoose');
var io = require('socket.io')(http);

var HOST = 'oasys.yiboji.net'
var PORT = 8080;

io.on('connection',function(socket){
	console.log('chart socket is connected');
	socket.on('disconnect',function(){
		console.log('chart socket disconnected');
	});
});

mongoose.connect('mongodb://localhost/admin');
app.use(express.static(__dirname+'/public'));

var node1 = mongoose.model('node1',{
	temp:Number,
	cap:Number,
	status:Number,
	volt:Number,
	curr:Number
});
http.listen(80);
console.log("NOW is listening PORT 80");

app.get('/api/data',function(req,res){
	sort = {'_id':1};
	node1.find(function(err,data){
		if(err){
			concole.log('ERROR'+err);
			res.send(err);
		}
		console.log(data);
		res.json(data);
	}).sort(sort);
});
app.get('*',function(req,res){
	console.log("send html to browser");
	res.sendFile(__dirname+'/public/index.html');
});

net.createServer(function (socket){
	console.log('connected:' + socket.remoteAddress+':'+socket.remotePort);
	socket.on('data',function(data){
		var jsonobj = JSON.parse(data);
		node1.create({
			temp:jsonobj.temp,
			cap:jsonobj.cap,
			status:jsonobj.status,
			volt:jsonobj.volt,
			curr:jsonobj.curr
		},function(err,inserted){
			if(err)
				console.log("ERR:insert DB"+err);
			io.emit('chart',jsonobj);
			console.log("chart socket just emit"+jsonobj);
		});
		console.log(socket.remoteAddress+':DATA\n'+data);
	});
	socket.on('end',function(){
		console.log('END:'+socket.remoteAddress+':'+socket.remotePort);
	});
}).listen(PORT);

console.log("listning to port 8080");
