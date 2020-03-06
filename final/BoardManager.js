
const bd = require("./Board")
const Messages = require("./messages").MESSAGES
class BoardManager{
    constructor()
    {
        this.board = new bd.Board(5)
        this.boatList = []
    }

    GameOver()
    {
        let gameOver = true
        for(let i =0; i < this.boatList.length; i++)
        {
            if(this.boatList[i].isAlive())
            {
                gameOver = false
            }
        }
        return gameOver;
    }
    addBoat(b)
    {
        let isHorizontal = (Math.floor(Math.random() * 2) === 1)
        b.isHorizontal = isHorizontal
        if(isHorizontal)
        {
            let x = Math.abs(Math.floor(Math.random() * this.board.size) - b.length)
            let y = Math.abs(Math.floor(Math.random() * this.board.size) - b.length)
            
            while(x + b.length > this.board.size)
            {
                x = Math.abs(Math.floor(Math.random() * this.board.size) - b.length)
            }

            b.startX = x
            b.startY = y
            for(let i = 0; i < b.length; i++)
            {
                this.board.replace(x + i, y, bd.Board.TILES.values[bd.Board.TILES.BOAT])
            }

        } else {

            let x = Math.abs(Math.floor(Math.random() * this.board.size) - b.length)
            let y = Math.abs(Math.floor(Math.random() * this.board.size) - b.length)
            
            while(y + b.length > this.board.size)
            {
                y = Math.abs(Math.floor(Math.random() * this.board.size) - b.length)
            }

            b.startX = x
            b.startY = y
            
            for(let i = 0; i < b.length; i++)
            {
                this.board.replace(x, y + i, bd.Board.TILES.values[bd.Board.TILES.BOAT])
            }
            
        }
    }


    //returns the proper message based in the 
    //respective 
    takeHit(x, y)
    {
        let tile = this.board.getTile(x,y)
        switch(tile)
        {
            case bd.Board.TILES.values[bd.Board.TILES.BOAT]:
                console.log("It's a hit")
                this.board.replace(x,y, bd.TILES.values[bd.Board.TILES.HIT])
                return Messages.ATTACK_HIT

                
            case bd.Board.TILES.values[bd.Board.TILES.OCEAN]:
                console.log("It's a miss")
                this.board.replace(x,y, bd.Board.TILES.values[bd.Board.TILES.MISS])
                return Messages.ATTACK_MISS

            case bd.Board.TILES.values[bd.Board.TILES.MISS]:
                console.log("Target already attacked")
                return Messages.BAD_ATTACK_COORDS

            case bd.Board.TILES.values[bd.Board.TILES.HIT]:
                console.log("Target already hit")
                return Messages.BAD_ATTACK_COORDS
            
            default:
                console.log("Invalid target")
                return Messages.BAD_ATTACK_COORDS
        }
    }
}

module.exports = {
    BoardManager
}
