const inq = require("inquirer")
const Messages = require("./messages").MESSAGES;
const tiles = require("./Board").Board.TILES
const mgr = require("./BoardManager")
const bt = require("./Boat")

class Player {
    constructor(name = "") {
        this.PlayerBoard = new mgr.BoardManager()
    	this.hasUserInput = false
	    this.EnemyBoard = new mgr.BoardManager()
        let boat = new bt.Boat(3)
        this.PlayerBoard.addBoat(boat)
        this.name = name
        
    }

    async random_coords(){
        let x = Math.floor(Math.random() * 5)
        let y = Math.floor(Math.random() * 5)
        return [x, y] 
    }

    async prepare_attack_message(attack_coords)
    {
        let str = ""
        str += Messages.ATTACK.toString()
        str += ":" + await attack_coords.join(",")
        return str
    }

    async update_player(resp_message)
    {
        
        let message_type = parseInt(resp_message.split(":")[0])
       

        switch(message_type)
        {
            
            case Messages.ATTACK:
                //given string "1:1,1"
                //msg_coords = [0, 1]
                let msg_coords = resp_message.split(":")[1].split(',').map( x=> parseInt(x))
                let handled_message = await this.PlayerBoard.takeHit(msg_coords[0], msg_coords[1])
                
                //send different types of responses based on the taking damage
                //functionality
                if (handled_message === Messages.BAD_ATTACK_COORDS) {
                    let bad_coords = `${Messages.BAD_ATTACK_COORDS}:${msg_coords.join(',')}`
                    return bad_coords
                } else if (handled_message === Messages.ATTACK_MISS){
                    let miss_coords = `${Messages.BAD_ATTACK_COORDS}:${msg_coords.join(',')}`
                    return miss_coords
                } else if (handled_message === Messages.ATTACK_HIT){
                    let hit_coords = `${Messages.ATTACK_HIT}:${msg_coords.join(",")}`
                    return hit_coords
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
                //TODO check if coords were in bounds
                let coords = resp_message.split(":")[1].split(",").map( x => parseInt(x))
                let new_coords = this.random_coords()
                let attack_msg = `${Messages.ATTACK}:${(await new_coords).join(',')}`


                return attack_msg
            



            case Messages.GAME_OVER:
                payload = parseInt(resp_message.split(":")[1])
                if(payload === 1)
                {
                    console.log("You won")
                } else {
                    console.log("You lost")
                }
                
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


}




module.exports = {
    Player
}
