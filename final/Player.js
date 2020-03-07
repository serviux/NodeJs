const inq = require("inquirer")
const zmq = require("zeromq")
const Messages = require("./messages").MESSAGES;
const tiles = require("./Board").Board.TILES
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
        this.sock.on("message", this.handle_response)

        
    } 
    async initAsClient(){
        this.sock = zmq.socket("rep")
        this.sock = this.sock.bind("tcp://127.0.0.1:5000")
        this.sock.on("message", this.handle_response)
    }

    
    async sendAttack(attack_coords)
    {
        let msg_str = ""
        msg_str += Messages.ATTACK + ":" 
        msg_str += attack_coords.join(",") 
        this.sock.send(msg_str)
    }

    async sendBadCoords(msg)
    {
        this.sock.send(msg)
    }

    async random_coords(){
        let x = Math.floor(Math.random() * 5)
        let y = Math.floor(Math.random() * 5)
        return [x, y] 
    }

    async handle_response(resp_message)
    {
        let encoded = await resp_message.toString()
        let message_type = parseInt(encoded.split(":")[0])
       

        switch(message_type)
        {
            
            case Messages.ATTACK:
                //given string "1:1,1"
                //msg_coords = [0, 1]
                let msg_coords = encoded.split(":")[1].split(',').map( x=> parseInt(x))
                console.log(this)
                let handled_message = await PlayerBoard.takeHit(msg_coords[0], msg_coords[1])
                
                //send different types of responses based on the taking damage
                //functionality
                if (handled_message === Messages.BAD_ATTACK_COORDS) {
                    bad_coords = `${Messages.BAD_ATTACK_COORDS}:${msg_coords.join(',')}`
                    this.sendBadCoords(bad_coords)
                } else if (handled_message === Messages.ATTACK_MISS){
                    miss_coords = `${Messages.BAD_ATTACK_COORDS}:${msg_coords.join(',')}`
                    this.sock.send(miss_coords)
                } else if (handled_message === Messages.ATTACK_HIT){
                    hit_coords = `${Messages.ATTACK_HIT}:${msg_coords.join(",")}`
                    this.sock.send(hit_coords)
                } 
                
                break;

            

            //The following cases are sent from the host to the client 
            //when they recieve the attack response
            case Messages.ATTACK_MISS:
                
                coords = encoded.split(":")[1].split(',').map( x=> parseInt(x))
                this.EnemyBoard.board.replace(coords[0], coords[1], tiles.MISS)
                this.display()
                break;
            case Messages.ATTACK_HIT:
                
                
                coords = encoded.split(":")[1].split(',').map( x=> parseInt(x))
                this.EnemyBoard.board.replace(coords[0], coords[1], tiles.HIT)
                this.display()
                console.log("It's a hit")
                break;


            case Messages.BAD_ATTACK_COORDS:
                let new_coords = await this.getInput()
                await this.sendAttack(new_coords)
                break;
            



            case Messages.GAME_OVER:
                payload = parseInt(resp_message.split(":")[1])
                if(payload === 1)
                {
                    console.log("You won")
                } else {
                    console.log("You lost")
                }
                
                this.destroy()
                console.log("Game Ended ")
                break;

        }

    }

    async display(clear = true) {

        if(clear)
        {
            for(let i = 0 ; i < 100; i++){
                console.log("")
            }
        }
        console.log("Enemy Board")
        this.EnemyBoard.board.display()
        console.log("")
        console.log("Your Board")
        this.PlayerBoard.board.display()
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

    async destroy(){
        this.sock.close()
    }

}




module.exports = {
    Player
}
