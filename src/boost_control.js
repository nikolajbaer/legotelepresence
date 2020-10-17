//https://github.com/ttu/lego-boost-browser
import LegoBoost from 'lego-boost-browser';

export default class BoostController {
    constructor(){
        this.boost = new LegoBoost();
    }    

    connected(){
        return this.boost.connected
    }

    connect(){
        console.log("connecting..")
        const config = {};
        this.boost.connect();
    }

    disconnect(){
        this.boost.disconnect();
    }

    forward(){
        this.boost.drive(1);
    }

    back(){
        this.boost.drive(-1);
    }

    left(){
        this.boost.turn(45)
    }

    right(){
        this.boost.turn(-45)
    }
}
