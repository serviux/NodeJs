

class Board {
    constructor(size){
        this.size = size

        //initialize board
        let board = []
        for(let i = 0; i < size; i++){
            let row = []
            for(let j = 0; j < size; j++)
            {
                row.push(Board.TILES.OCEAN)
            }
            board.push(row)
        }

        this.board = board
    }

    display()
    {
        for(let i = 0; i < this.size; i++)
        {
            console.log(this.board[i].join(" "))
        }
    }

    replace(x, y , tile)
    {
        this.board[x][y] = tile
    }

    getTile(x, y)
    {
        return this.board[x][y]
    }


}
Board.TILES = {
    OCEAN: "O",
    BOAT: "B",
    MISS: "M",
    HIT: "H"
}

module.exports = {
    Board
}



