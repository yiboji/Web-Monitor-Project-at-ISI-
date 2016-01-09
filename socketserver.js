var net = require('net');
var HOST = 'oasys.yiboji.net'
var PORT = 8080;

net.createServer(function (socket){
	console.log('connected:' + socket.remoteAddress+':'+socket.remotePort);
	socket.on('data',function(data){
		console.log(socket.remoteAddress+':DATA\n'+data);
	});
	socket.on('end',function(){
		console.log('END:'+socket.remoteAddress+':'+socket.remotePort);
	});
}).listen(PORT);

console.log("listning to port 8080");
