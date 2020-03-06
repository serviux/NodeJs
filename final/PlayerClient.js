const player = require("./Player")

const client = new player.Player()

game_over = false
async function main(){
    await client.initAsClient()
    
    client.display()

    

    
}

main()