import { Fader } from "../../lib/extensions/ActionExtension";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SwitchButton extends cc.Component {
    @property(cc.Node)
    public switchContent : cc.Node = null;

    private _switchStatus = 1;
    private _isSwitching = false;
    onLoad () {

    }

    start () {

    }
    public switchToStatus(status){
        //防止重复操作
        if(this._isSwitching==true)return;else this._isSwitching = true;

        let switchBar = this.switchContent.getChildByName("Bar");
        let moveRange = this.switchContent.width - switchBar.width - 20;
        let color;
        if(status===0){
            moveRange = -moveRange;
            color = cc.color(175,175,175);
        }else{
            color = cc.color(172,239,120);
        }
        let action = cc.sequence(
            cc.spawn(
                cc.moveBy(0.125, cc.v2(moveRange, 0)),
                Fader.create(0.125,color)
            ),
            cc.callFunc(()=>{
                this._switchStatus = status;
                this._isSwitching = false;
            }));
        switchBar.runAction(action);
    }

    public setStatus(status){
        let switchBar = this.switchContent.getChildByName("Bar");
        let moveRange = this.switchContent.width - switchBar.width - 20;
        let color;

        if(status===0){
            moveRange = switchBar.position.x-moveRange;
            color = cc.color(175,175,175);
        }else{
            moveRange = switchBar.position.x;
            color = cc.color(172,239,120);
        }
        this._switchStatus = status;
        switchBar.color = color;
        switchBar.setPosition(moveRange,0);
        switchBar.x;
    }
    public switch () {
        if(!this.switchContent)return;
        switch (this._switchStatus) {
            case 0 :
                this.switchToStatus(1);
                break;
            case 1 :
                this.switchToStatus(0);
                break;
        }
    }
    //当前状态
    public get status(){
        if(this._isSwitching){
            if(this._switchStatus==0)return 1;
            else return 0;
        }else{
            return this._switchStatus;
        }
    }
    // update (dt) {}
}
