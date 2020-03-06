const inq = require("inquirer")
const zmq = require("zeromq")
const Messages = require("./messages").MESSAGES;

const mgr = require("./BoardManager")
const bt = require("./Boat")

class Player {
    constructor() {
        this.PlayerBoard = new mgr.BoardManager()
    	this.hasUserInput = false
	    this.EnemyBoard = new mgr.BoardManager()
        let boat = new bt.Boat(3)
        this.PlayerBoard.addBoat(boat)
        
    }
    async initAsHost(){
        this.sock = zmq.socket("req")
        await this.sock.connect("tcp://127.0.0.1:5000")
        this.sock.on("message", function(reply){
            console.log("Reply: " + reply.toString())
        })

        
    }
    async initAsClient(){
        this.sock = zmq.socket("rep")
        this.sock = this.sock.bind("tcp://127.0.0.1:5000")
        this.sock.on("message", function(request){
            console.log("Request: " + request.toString())
        })
    }

    
    async sendAttack(attack_coords)
    {
        let msg_str = ""
        msg_str += Messages.SEND_ATTACK_COORDS + ":" 
        msg_str += attack_coords.join(",") 
        this.sock.send(msg_str)
    }

    async sendBadCoords(msg)
    {
        this.sock.send(msg)
    }

    async handle_response(resp_message)
    {
        let message_type = parseInt(resp_message.split(":")[0])
        let resp_to_send = ""

        switch(message_type)
        {
            
            case Messages.ATTACK_RESPONSE:
                //given string "1:1,1"
                //msg_coords = [0, 1]
                let msg_coords = resp_message.split(":")[1].split(',').map( x=> parseInt(x))
                let handled_message = this.PlayerBoard.takeHit(msg_coords[0], msg_coords[1])
                if (handled_message === Messages.BAD_ATTACK_COORDS) {
                    bad_coords = `${Messages.BAD_ATTACK_COORDS}:${msg_coords.join(',')}`
                    this.sendBadCoords(bad_coords)
                }
                
                break;
            
            case Messages.GAME_OVER:
                break;

        }

    }

    display() {
        console.log("Enemy Board")
        this.EnemyBoard.board.display()
        console.log("")
        console.log("Your Board")
        this.PlayerBoard.board.display()
    }
    async request() {
 
    
    }



    async getInput() {

        let coords = []
        let questX = {
            type: "number",
            name: "x",
            message: "Enter x coord: "
        }
        let questY = {
            type: "number",
            name: "y",
            message: "Enter y coord: "
        }

        coords.push(await inq.prompt(questX).then(answers => answers["x"]))
        coords.push(await inq.prompt(questY).then(answers => answers["y"]))
	this.hasUserInput = true    	
	return coords
    }

    destroy(){
        this.sock.close()
    }

}

async function main() {
    let player = new Player()
    player.display()

    let coords = await player.getInput()
    console.log(await coords)
    
    player.destroy()
}


module.exports = {
    Player
}
