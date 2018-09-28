import { inject } from "../../lib/framework/Injector/InjectDecorator";
import { IocView } from "../../lib/extensions/IocView";
import { MainSignalEnum } from "../signal/MainSignalEnum";
import { __IC_Model, ModelType } from "../util/Model";
import { MainModel } from "../Model/MainModel";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PauseNode extends IocView {
    @inject(__IC_Model,ModelType.Main)
    mMdl:MainModel
    @property(cc.Label)
    score:cc.Label = null;

    onLoad () {
        super.onLoad();
    }

    start () {
        super.start();
    }
    //重新开始按钮被点击时
    onRestartClicked(){
        this.sMgr.get(MainSignalEnum.Restart).dispatch();
    }
    //排行榜按钮被点击时
    onLookRankClicked(){
        this.sMgr.get(MainSignalEnum.LookRank).dispatch();
    }
    // update (dt) {}
}
