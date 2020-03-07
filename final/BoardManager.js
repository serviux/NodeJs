
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
                this.board.replace(x + i, y,bd.Board.TILES.BOAT)
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
                this.board.replace(x, y + i, bd.Board.TILES.BOAT)
            }
            
        }
    }


    //returns the proper message based in the 
    //respective 
    async takeHit(x, y)
    {
        let tile = this.board.getTile(x,y)
        switch(tile)
        {
            case bd.Board.TILES.BOAT:
                
                this.board.replace(x,y, bd.TILES.values[bd.Board.TILES.HIT])
                
                if(!this.boatList[0].isAlive())
                {
                    return Messages.GAME_OVER
                    
                }else {
                    this.boatList[0].takeHit()
                    return Messages.ATTACK_HIT
                }
               

                
            case bd.Board.TILES.OCEAN:
                
                this.board.replace(x,y, bd.Board.TILES.MISS)
                return Messages.ATTACK_MISS

            case bd.Board.TILES.MISS:
                
                return Messages.BAD_ATTACK_COORDS

            case bd.Board.TILES.HIT:
            
                return Messages.BAD_ATTACK_COORDS
            
            default:
                
                return Messages.BAD_ATTACK_COORDS
        }
    }
}

module.exports = {
    BoardManager
}
