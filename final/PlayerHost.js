const player = require("./Player")

const host = new player.Player()

game_over = false
async function main(){
    await host.initAsHost()

    host.display()

    let attack_coords = [0,1] // await host.getInput()
    await host.sendAttack(attack_coords)
    
    
}

main()