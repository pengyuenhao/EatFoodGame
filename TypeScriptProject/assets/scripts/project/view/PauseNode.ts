import { inject } from "../../lib/framework/Injector/InjectDecorator";
import { IocView } from "../../lib/extensions/IocView";
import { MainSignalEnum } from "../signal/MainSignalEnum";

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends IocView {

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
