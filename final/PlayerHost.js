const player = require("./Player")
const zmq = require("zeromq")

// const host = new player.Player(name="host", asComputer=true)
const host = new player.Player(name="host")

game_over = false
async function main(){
    sock = zmq.socket("req")
    sock.connect("tcp://127.0.0.1:5000")
    sock.on("message", async function(reply){
        let encoded_msg = reply.toString()
        let response = await host.update_player(encoded_msg)
        await host.display( clear = false)
        if(response != null){
            await sock.send(response)
        }
    })

    host.display(clear = false)

    let attack_coords = await host.getInput() 
    let attack_msg = await host.prepare_attack_message(attack_coords)
    await sock.send(attack_msg)
    
}

main()