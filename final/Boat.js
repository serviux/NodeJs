
class Boat {


    constructor(length)
    {
        this.length = length
        this.health = []
        this.startX = -1
        this.startY = -1
        this.isHorizontal = true

        for(let i = 0; i < this.length;i++)
        {
            this.health.push(true)
        }
    }

    takeHit(){
        
        for(let i = 0; i < this.length; i++){
            if(this.health[i]){
                this.health[i] = false
                return true
            }
        }
        return false
    }

    isAlive()
    {
        
        for(i = 0; i < this.health.length; i++)
        {
            if(this.health[i])
            {
                return true
            }
        }
        return false
    }

    willCollide(otherBoat)
    {
        let thisMaxX;
        let thisMaxY;
        let otherMaxX;
        let otherMaxY;
        let thisMinY;
        let thisMinX;
        if(this.isHorizontal)
        {
            thisMaxX = this.startX + this.length
            thisMaxY = this.startY
        } else {
            thisMaxX = this.startX
            thisMaxY = this.startY + this.length
        }
        if(otherBoat.isHorizontal)
        {
            otherMaxX = otherBoat.startX + otherBoat.length
            otherMaxY = otherBoat.startY
        } else 
        {
            otherMaxY = otherBoat.startY + otherBoat.length
            otherMaxX = otherBoat.startX
        }  
    }
}

module.exports = {
    Boat
}