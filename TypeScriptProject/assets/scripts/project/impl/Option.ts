import Common from "../Common";
import AudioManager from "../util/AudioManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Option extends cc.Component {
    @property(cc.Node)
    modeSwitchButton : cc.Node;
    @property(cc.Node)
    audioSwitchButton : cc.Node;
    onLoad () {

    }

    start () {
        let that = this;
        setTimeout(() => {
            that.modeSwitchButton.getComponent("SwitchButton").setStatus(Common.operatorMode);
            that.audioSwitchButton.getComponent("SwitchButton").setStatus(Common.enableAudio);
        }, 0);
    }

    backHome(){
        cc.director.loadScene('Begin');
    }

    modeSwitch () {
        Common.operatorMode = this.modeSwitchButton.getComponent("SwitchButton").status;
        console.info("[切换操作模式]"+Common.operatorMode);
    }

    audioSwitch(){
        Common.enableAudio = this.audioSwitchButton.getComponent("SwitchButton").status;
        if(Common.enableAudio==0){
            AudioManager.Instance.setVolume(0);
        }else{
            AudioManager.Instance.setVolume(1);
        }
        console.info("[切换音效模式]"+Common.enableAudio);
    }
    // update (dt) {}
}
