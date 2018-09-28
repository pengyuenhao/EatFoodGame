import { IocComponet } from "../../lib/extensions/IocComponet";
import { inject } from "../../lib/framework/Injector/InjectDecorator";
import { __IC_SignalManager, ISignalManager } from "../../lib/framework/Signal/SignalManager";
import { MainSignalEnum } from "../signal/MainSignalEnum";
import { MainModel } from "../Model/MainModel";
import { __IC_InjectBinder, IInjectBinder } from "../../lib/framework/Injector/InjectBinder";
import { __IC_Model, ModelType } from "../util/Model";
import { IocView } from "../../lib/extensions/IocView";

const {ccclass,property} = cc._decorator

@ccclass
export default class LogicNode extends IocView {
    @inject(__IC_Model,ModelType.Main)
    mMdl : MainModel;
    @inject(__IC_InjectBinder)
    inj: IInjectBinder;

    onLoad(){
        super.onLoad();
        //注册节点
        this.inj.bind(cc.Node).toName("LogicNode").toValue(this.node).unBind();
    }
    start(){
        super.start();
    }
    update(dt){
        if(this.sMgr && !this.mMdl.pauseFlag){
            this.sMgr.get(MainSignalEnum.Update).dispatch(dt);
        }
    }
}