import Common from "../Common";

const {ccclass, property} = cc._decorator

@ccclass
export default class Begin extends cc.Component {

/*     @property(cc.Node)
    playButton = null */

    onLoad () {
        
    }

    beginGame() {
        cc.director.loadScene('Game')
    }

    lookRank(){
        cc.director.loadScene("Rank");
    }

    option(event:cc.Event.EventTouch){
        cc.director.loadScene("Option");
    }
}