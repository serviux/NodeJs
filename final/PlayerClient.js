const player = require("./Player")
const zmq = require("zeromq") 
const client = new player.Player(name="Client", asComputer=true)

game_over = false
async function main(){
    let sock = zmq.socket("rep")
    sock = await sock.bind("tcp://127.0.0.1:5000")
    sock.on("message", async function(reply){
        let encoded_msg = reply.toString()
        let response = await client.update_player(encoded_msg)
        await client.display(clear = false)
        if(response != null){
            await sock.send(response)
        }
    })
   

}

main()