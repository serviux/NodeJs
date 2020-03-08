const inq = require("inquirer")
const Messages = require("./messages").MESSAGES;
const tiles = require("./Board").Board.TILES
const mgr = require("./BoardManager")
const bt = require("./Boat")

class Player {
    constructor(name = "", asComputer = false) {
        this.PlayerBoard = new mgr.BoardManager()
        this.EnemyBoard = new mgr.BoardManager()
        this.asComputer = asComputer
        let boat = new bt.Boat(3)
        this.PlayerBoard.addBoat(boat)
        this.name = name
        this.values = []
        this.turn = 1

        if (asComputer) {
            let values = []
            for (let i = 0; i < 5; i++) {
                for (let j = 0; j < 5; j++) {
                    let coords = [i, j]
                    values.push(coords)
                }
            }
            this.values = values
        }


    }

    async random_coords() {

        let randIdx = Math.floor(Math.random() * values.length)
        return this.values.splice(randIdx, 1)
    }

    async prepare_attack_message(attack_coords) {
        let str = ""
        str += Messages.ATTACK.toString()
        str += ":" + await attack_coords.join(",")
        return str
    }

    async update_player(resp_message) {

        let message_type = parseInt(resp_message.split(":")[0])


        switch (message_type) {
            //handing for recieving attack message
            case Messages.ATTACK:
                //given string "1:1,1"
                //msg_coords = [0, 1]
                let msg_coords = resp_message.split(":")[1].split(',').map(x => parseInt(x))
                let handled_message = await this.PlayerBoard.takeHit(msg_coords[0], msg_coords[1])

                //send different types of responses based on the taking damage
                //functionality
                if (handled_message === Messages.BAD_ATTACK_COORDS) {
                    let bad_coords = `${Messages.BAD_ATTACK_COORDS}:${msg_coords.join(',')}`
                    return bad_coords
                } else if (handled_message === Messages.ATTACK_MISS) {
                    let miss_coords = `${Messages.ATTACK_MISS}:${msg_coords.join(',')}`
                    return miss_coords
                } else if (handled_message === Messages.ATTACK_HIT) {
                    let hit_coords = `${Messages.ATTACK_HIT}:${msg_coords.join(",")}`
                    return hit_coords
                } else if (handled_message === Messages.GAME_OVER){
                    console.log("Game over You lost")
                    return `${Messages.GAME_OVER}:1`
                }

                break;



            case Messages.OP_TURN_ENDED:
                this.turn++
                let new_coords = this.getInput()
                let attack_msg = `${Messages.ATTACK}:${(await new_coords).join(',')}`
                return attack_msg

                //The following cases are sent from the opponent to the player 
                //when they recieve the attack response
            case Messages.ATTACK_MISS:

                let coords = resp_message.split(":")[1].split(',').map(x => parseInt(x))
                this.EnemyBoard.board.replace(coords[0], coords[1], tiles.MISS)
                this.display()
                return `${Messages.OP_TURN_ENDED}:`
            case Messages.ATTACK_HIT:


                let c = resp_message.split(":")[1].split(',').map(x => parseInt(x))
                this.EnemyBoard.board.replace(c[0], c[1], tiles.HIT)
                this.display()
                return `${Messages.OP_TURN_ENDED}:`


                //attack coord validation
                //also goes here after attack miss 
                //but will end the turn instead of 
                //sending new attack coords
            case Messages.BAD_ATTACK_COORDS:



                let new_coords2 = this.getInput()
                let attack_msg2 = `${Messages.ATTACK}:${(await new_coords2).join(',')}`
                return attack_msg2




            case Messages.GAME_OVER:
                let payload = parseInt(resp_message.split(":")[1])
                if (payload === 1) {
                    console.log("You won")
                } else {
                    console.log("You lost")
                }

                console.log("Game Ended ")
                break;

        }

    }

    async display(clear = true) {

        if (clear) {
            for (let i = 0; i < 100; i++) {
                console.log("")
            }
        }
        console.log("************")
        console.log("Turn: #" + this.turn)
        console.log("************")

        console.log("Enemy Board")
        this.EnemyBoard.board.display()
        console.log("")
        console.log("Your Board")
        this.PlayerBoard.board.display()
    }

    async getInput() {
        if (this.asComputer) {
            let randIdx = Math.floor(Math.random() * this.values.length)
            let coords = this.values.splice(randIdx, 1)
            return coords
        } else {


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
            return coords
        }
    }


}




module.exports = {
    Player
}