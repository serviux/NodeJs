

class Board {
    constructor(size){
        this.size = size

        //initialize board
        let board = []
        for(let i = 0; i < size; i++){
            let row = []
            for(let j = 0; j < size; j++)
            {
                row.push(Board.TILES.values[Board.TILES.OCEAN])
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
    OCEAN: 1,
    BOAT: 2,
    MISS: 3,
    HIT: 4,
    values: {
        1: "O",
        2: "B",
        3: "M",
        4: "H"

    }

}

module.exports = {
    Board
}



