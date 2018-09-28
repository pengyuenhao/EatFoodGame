import {__IC_SignalManager,ISignalManager} from "../../Lib/Framework/Signal/SignalManager"
import {MainModel} from '../context/MainModel';
import { inject } from '../../lib/framework/Injector/InjectDecorator';
import { IocView } from '../../lib/extensions/IocView';
import { __IC_Model, ModelType } from "../util/Model";
import { __IC_InjectBinder, IInjectBinder } from "../../lib/framework/Injector/InjectBinder";
import { MainSignalEnum } from "../signal/MainSignalEnum";

const {ccclass,property} = cc._decorator

@ccclass
export default class MainNode extends IocView {
    @inject(__IC_Model,ModelType.Main)
    mMdl: MainModel;
    @inject(__IC_InjectBinder)
    inj: IInjectBinder;

    onLoad() {
        super.onLoad();
    }

    start() {
        super.start();
        //注册节点
        this.inj.bind(cc.Node).toName("MainNode").toValue(this.node).unBind();
        //执行开始信号
        this.sMgr.get(MainSignalEnum.Start).dispatch();
    }

    update(dt) {

    }
}