var zmq = require("zeromq")

sock = zmq.socket("pull")

sock.connect("tcp://127.0.0.1:3000")
console.log("worker connected on port 3000")

sock.on("message", function(msg){
	console.log("work %s", msg.toString())
});
