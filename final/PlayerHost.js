const player = require("./Player")

const host = new player.Player()

game_over = false
async function main(){
    await host.initAsHost()

    host.display(clear = false)

    let attack_coords = await host.random_coords() // await host.getInput()
    await host.sendAttack(attack_coords)
    
    host.destroy()    
}

main()