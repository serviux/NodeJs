var zmq = require("zeromq")

var sock = zmq.socket("push");


sock.bindSync("tcp://127.0.0.1:3000")
console.log("Producer is bound to port 3000")

setInterval(function(){
	console.log("sending work")
	sock.send("some work");
}, 500)
