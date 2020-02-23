const inq = require("inquirer")
const zmq = require("zeromq")
const Messages = require("./messages").MESSAGES;

const mgr = require("./BoardManager")
const bt = require("./Boat")

class Player {
    constructor() {
        this.PlayerBoard = new mgr.BoardManager()
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

        await this.req.send()
    }
    async initAsClient(){
        this.sock = zmq.socket("rep")
        this.sock = this.sock.bind("tcp://127.0.0.1:5000")
        this.sock.on("message", function(request){
            console.log("Request: " + request.toString())
        })
    }

    
    async send()
    {
        this.sock.send("Hello")
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

main()